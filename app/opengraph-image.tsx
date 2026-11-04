import { ImageResponse } from "next/og";

export const alt = "Lily's Garden, a digital garden of essays, notes, poems and toys";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PETAL_COLORS = ["#E8ADB1", "#F29874", "#FAE680", "#88BF94", "#9EAAFA", "#CCA7ED"];

/** The card people see when a link to the garden is shared. */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        gap: 72,
        padding: "0 96px",
        background: "#101112",
        color: "#f4f4f2",
      }}
    >
      <svg width="260" height="260" viewBox="0 0 120 120">
        {PETAL_COLORS.map((color, index) => (
          <ellipse
            key={color}
            cx="60"
            cy="28"
            rx="15"
            ry="26"
            fill={color}
            transform={`rotate(${index * 60} 60 60)`}
          />
        ))}
        <circle cx="60" cy="60" r="13" fill="#FAE680" stroke="#F29874" strokeWidth="2" />
      </svg>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: -2 }}>Lily's Garden</div>
        <div style={{ fontSize: 36, marginTop: 20, color: "#a8a8a3", maxWidth: 640, lineHeight: 1.35 }}>
          Essays, notes, poems, games and toys. Come wander.
        </div>
      </div>
    </div>,
    size
  );
}
