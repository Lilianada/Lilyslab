"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { burstPetals } from "@/components/fun/FunLayer";
import { readFromLocalStorage, writeToLocalStorage } from "@/hooks/use-local-storage";

const WIDTH = 480;
const HEIGHT = 560;
const BASKET_WIDTH = 74;
const BASKET_HEIGHT = 22;
const BASKET_Y = HEIGHT - 44;
const BASKET_SPEED = 0.55; // px per ms, for keyboard play
const STARTING_LIVES = 3;
const BEST_SCORE_KEY = "petal_catch_best";
const PETAL_COLORS = ["#E8ADB1", "#CCA7ED", "#9EAAFA", "#F29874", "#F4DAA0"];

type Kind = "petal" | "lily" | "bee";
type Status = "ready" | "playing" | "paused" | "over";

interface Faller {
  kind: Kind;
  x: number;
  y: number;
  speed: number;
  sway: number;
  color: string;
}

const LOSS_LINES = [
  "The bees send their regards.",
  "Gravity: 1, you: a respectable effort.",
  "Every petal you missed is now compost. That's fine.",
  "Bees don't even like you that much. They were just passing through.",
];

function drawFaller(context: CanvasRenderingContext2D, faller: Faller) {
  const { x, y, kind, color, sway } = faller;
  context.save();
  context.translate(x, y);

  if (kind === "bee") {
    context.fillStyle = "#FAE680";
    context.beginPath();
    context.ellipse(0, 0, 13, 9, 0, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#1F1A24";
    context.fillRect(-4, -8.5, 3, 17);
    context.fillRect(3, -8, 3, 16);
    context.fillStyle = "rgba(255,255,255,0.75)";
    const flap = Math.sin(sway * 6) * 2;
    context.beginPath();
    context.ellipse(-3, -11 - flap, 6, 4, -0.4, 0, Math.PI * 2);
    context.ellipse(4, -11 - flap, 6, 4, 0.4, 0, Math.PI * 2);
    context.fill();
  } else if (kind === "lily") {
    context.fillStyle = "#FFFFFF";
    for (let i = 0; i < 6; i++) {
      context.rotate(Math.PI / 3);
      context.beginPath();
      context.ellipse(0, -10, 4.5, 10, 0, 0, Math.PI * 2);
      context.fill();
    }
    context.fillStyle = "#FAE680";
    context.beginPath();
    context.arc(0, 0, 4, 0, Math.PI * 2);
    context.fill();
  } else {
    context.rotate(Math.sin(sway) * 0.9);
    context.fillStyle = color;
    context.beginPath();
    context.ellipse(0, 0, 11, 6, 0, 0, Math.PI * 2);
    context.fill();
  }

  context.restore();
}

export function PetalCatch() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<Status>("ready");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(STARTING_LIVES);
  const [best, setBest] = useState(0);
  const [lossLine, setLossLine] = useState(LOSS_LINES[0]);

  // Game state lives in a ref: it changes every frame and shouldn't re-render React.
  const game = useRef({
    fallers: [] as Faller[],
    basketX: WIDTH / 2,
    score: 0,
    lives: STARTING_LIVES,
    elapsed: 0,
    sinceSpawn: 0,
    keys: { left: false, right: false },
  });

  useEffect(() => setBest(readFromLocalStorage(BEST_SCORE_KEY, 0)), []);

  const start = useCallback(() => {
    Object.assign(game.current, {
      fallers: [],
      basketX: WIDTH / 2,
      score: 0,
      lives: STARTING_LIVES,
      elapsed: 0,
      sinceSpawn: 0,
    });
    setScore(0);
    setLives(STARTING_LIVES);
    setStatus("playing");
  }, []);

  const endGame = useCallback(() => {
    const finalScore = game.current.score;
    setLossLine(LOSS_LINES[Math.floor(Math.random() * LOSS_LINES.length)]);
    setStatus("over");
    setBest((currentBest) => {
      if (finalScore <= currentBest) return currentBest;
      writeToLocalStorage(BEST_SCORE_KEY, finalScore);
      burstPetals();
      return finalScore;
    });
  }, []);

  // The render loop only runs during play, so an idle game uses no CPU.
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const state = game.current;

    const drawScene = () => {
      context.clearRect(0, 0, WIDTH, HEIGHT);
      state.fallers.forEach((faller) => drawFaller(context, faller));
      context.fillStyle = "#8a6a4f";
      context.beginPath();
      context.roundRect(state.basketX - BASKET_WIDTH / 2, BASKET_Y, BASKET_WIDTH, BASKET_HEIGHT, [3, 3, 14, 14]);
      context.fill();
      context.fillStyle = "#5d4532";
      context.fillRect(state.basketX - BASKET_WIDTH / 2 - 3, BASKET_Y - 2, BASKET_WIDTH + 6, 5);
    };

    drawScene();
    if (status !== "playing") return;

    let frameId = 0;
    let previous = performance.now();

    const tick = (now: number) => {
      const delta = Math.min(now - previous, 50);
      previous = now;
      state.elapsed += delta;
      state.sinceSpawn += delta;

      // Difficulty climbs for the first ninety seconds, then holds.
      const difficulty = Math.min(state.elapsed / 90000, 1);
      if (state.keys.left) state.basketX -= BASKET_SPEED * delta;
      if (state.keys.right) state.basketX += BASKET_SPEED * delta;
      state.basketX = Math.max(BASKET_WIDTH / 2, Math.min(WIDTH - BASKET_WIDTH / 2, state.basketX));

      if (state.sinceSpawn > 720 - difficulty * 430) {
        state.sinceSpawn = 0;
        const roll = Math.random();
        const kind: Kind = roll < 0.18 + difficulty * 0.17 ? "bee" : roll > 0.94 ? "lily" : "petal";
        state.fallers.push({
          kind,
          x: 24 + Math.random() * (WIDTH - 48),
          y: -20,
          speed: 0.11 + difficulty * 0.14 + Math.random() * 0.06,
          sway: Math.random() * Math.PI * 2,
          color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
        });
      }

      state.fallers = state.fallers.filter((faller) => {
        faller.y += faller.speed * delta;
        faller.sway += delta * 0.004;
        if (faller.kind !== "bee") faller.x += Math.sin(faller.sway) * 0.4;

        const caught =
          faller.y > BASKET_Y - 8 &&
          faller.y < BASKET_Y + BASKET_HEIGHT &&
          Math.abs(faller.x - state.basketX) < BASKET_WIDTH / 2 + 8;

        if (caught) {
          if (faller.kind === "bee") {
            state.lives -= 1;
            setLives(state.lives);
          } else {
            state.score += faller.kind === "lily" ? 5 : 1;
            setScore(state.score);
          }
          return false;
        }
        return faller.y < HEIGHT + 24;
      });

      drawScene();

      if (state.lives <= 0) {
        endGame();
        return;
      }
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [status, endGame]);

  // Pause rather than punish anyone who switches tabs.
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) setStatus((current) => (current === "playing" ? "paused" : current));
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  useEffect(() => {
    const setKey = (event: KeyboardEvent, isDown: boolean) => {
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") game.current.keys.left = isDown;
      else if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") game.current.keys.right = isDown;
      else return false;
      return true;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (setKey(event, true)) event.preventDefault();
    };
    const onKeyUp = (event: KeyboardEvent) => setKey(event, false);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  const moveBasket = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    game.current.basketX = ((event.clientX - rect.left) / rect.width) * WIDTH;
  };

  return (
    <div className="max-w-[480px] mx-auto">
      <div className="flex justify-between text-xs mb-2" aria-live="polite">
        <span>Score: {score}</span>
        <span aria-label={`${lives} lives left`}>{"🌸".repeat(Math.max(lives, 0)) || "🥀"}</span>
        <span className="text-muted-foreground">Best: {best}</span>
      </div>

      <div className="relative rounded-md border overflow-hidden bg-gradient-to-b from-card to-accent">
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          aria-label="Petal Catch game. Move the basket with your pointer, finger, or the arrow keys."
          className="block w-full touch-none"
          onPointerMove={moveBasket}
          onPointerDown={moveBasket}
        />

        {status !== "playing" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-background/70 backdrop-blur-sm">
            <p className="text-lg font-medium mb-2">
              {status === "ready" && "Petal Catch"}
              {status === "paused" && "Paused"}
              {status === "over" && (score > 0 && score >= best ? `New best: ${score}!` : `You caught ${score}`)}
            </p>
            <p className="text-xs text-muted-foreground mb-5 max-w-xs">
              {status === "ready" && "Catch petals (1 point) and lilies (5). Three bees and you're done. Missed petals don't count against you, because life is hard enough."}
              {status === "paused" && "The petals will wait."}
              {status === "over" && lossLine}
            </p>
            <button
              type="button"
              onClick={status === "paused" ? () => setStatus("playing") : start}
              className="hover-wiggle rounded-md border border-dashed border-codeRed px-4 py-2 text-sm text-codeRed hover:bg-accent"
            >
              {status === "ready" && "Start"}
              {status === "paused" && "Keep going"}
              {status === "over" && "Again"}
            </button>
          </div>
        )}
      </div>
      <p className="text-[10px] text-muted-foreground text-center mt-2">Mouse, finger, or arrow keys.</p>
    </div>
  );
}
