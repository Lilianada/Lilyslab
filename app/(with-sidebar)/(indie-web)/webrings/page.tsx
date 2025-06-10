"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import {
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  CircleDot,
  Globe,
  Link2,
} from "lucide-react";

export default function WebringsPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <>
      <ScrollProgress
        color="bg-extra-lavender"
        height={3}
        glow={true}
        glowColor="rgba(var(--primary), 0.6)"
        glowIntensity="12px"
      />

      <div
        className={`container max-w-4xl mx-auto py-12 px-4 md:px-8 text-foreground ${
          isLoaded ? "animate-fade-in" : "opacity-0"
        }`}
      >
        <header className="mb-12">
          <div className="flex flex-col mb-4">
            <h1 className="mb-1 text-xl font-medium">Webrings</h1>
            <p className="text-sm text-muted-foreground">
              Collections of like-minded websites connected in a virtual circle.
            </p>
          </div>
          <motion.div
            variants={itemVariants}
            className="mt-8 group md:col-span-2 relative bg-gradient-to-br from-transparent to-transparent backdrop-blur-sm border-2 border-dashed border-extra-peach/30 dark:border-extra-peach/20 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            <p className="text-sm">
              A{" "}
              <a
                href="https://en.wikipedia.org/wiki/Webring"
                className="text-extra-peach font-medium hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                webring
                <ArrowUpRight className="inline h-3 w-3 ml-1" />
              </a>{" "}
              is a collection of websites made by like-minded folks, usually
              centered around a topic, aesthetic, or common interest. Here are
              the webrings my personal website is part of. Click on the arrows
              to visit my neighbor sites on each ring. Some webrings also let
              you visit a random site part of the ring. Pick a ring and you'll
              be off!
            </p>
          </motion.div>
        </header>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Meta Ring */}
          <motion.div
            variants={itemVariants}
            className="group relative bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-2 border-extra-cream/30 dark:border-extra-cream/10 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-extra-cream/10 dark:bg-extra-cream/5 rounded-full blur-2xl group-hover:bg-extra-cream/20 transition-all duration-500"></div>

            <h2 className="text-xl font-medium mb-3 flex items-center">
              <a
                href="https://meta-ring.hedy.dev/"
                className="text-extra-peach hover:text-extra-peach/80 inline-flex items-center gap-1 group/link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Meta Ring
                <ArrowUpRight className="h-4 w-4 opacity-70 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
              </a>
            </h2>
            <p className="mb-6 text-sm text-foreground/80 dark:text-foreground/70">
              Personal website tinkerers; those with meta pages or{" "}
              <a
                href="/colophon"
                className="text-extra-lavender hover:underline"
              >
                colophons
              </a>
              .
            </p>

            <div className="flex items-center justify-between mt-4 border-t border-extra-cream/20 dark:border-extra-cream/10 pt-4">
              <a
                href="https://meta-ring.hedy.dev/previous"
                className="text-foreground hover:text-extra-peach transition-colors duration-200 p-2 rounded-full hover:bg-extra-peach/10"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Previous site in Meta Ring"
              >
                <ArrowLeft className="h-5 w-5" />
              </a>

              <a
                href="https://meta-ring.hedy.dev/random"
                className="text-foreground hover:text-extra-peach transition-colors duration-200 flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-extra-peach/10"
                target="_blank"
                rel="noopener noreferrer"
              >
                <CircleDot className="h-4 w-4 mr-1" />
                <span className="text-sm">Random</span>
              </a>

              <a
                href="https://meta-ring.hedy.dev/next"
                className="text-foreground hover:text-extra-peach transition-colors duration-200 p-2 rounded-full hover:bg-extra-peach/10"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Next site in Meta Ring"
              >
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </motion.div>

          {/* IndieWeb */}
          <motion.div
            variants={itemVariants}
            className="group relative bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-2 border-extra-lavender/30 dark:border-extra-lavender/10 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-extra-lavender/10 dark:bg-extra-lavender/5 rounded-full blur-2xl group-hover:bg-extra-lavender/20 transition-all duration-500"></div>

            <h2 className="text-xl font-medium mb-3 flex items-center">
              <a
                href="https://indieweb.org/"
                className="text-extra-peach hover:text-extra-peach/80 inline-flex items-center gap-1 group/link"
                target="_blank"
                rel="noopener noreferrer"
              >
                IndieWeb
                <ArrowUpRight className="h-4 w-4 opacity-70 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
              </a>
            </h2>
            <p className="mb-6 text-sm text-foreground/80 dark:text-foreground/70">
              For folks adding{" "}
              <a
                href="https://indieweb.org/building-blocks"
                className="text-extra-lavender hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                IndieWeb building blocks
                <ArrowUpRight className="inline h-3 w-3 ml-0.5" />
              </a>{" "}
              to their personal websites.
            </p>

            <div className="flex items-center justify-between mt-4 border-t border-extra-lavender/20 dark:border-extra-lavender/10 pt-4">
              <a
                href="https://xn--sr8hvo.ws/previous"
                className="text-foreground hover:text-extra-peach transition-colors duration-200 p-2 rounded-full hover:bg-extra-peach/10"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Previous site in IndieWeb Webring"
              >
                <ArrowLeft className="h-5 w-5" />
              </a>

              <a
                href="https://xn--sr8hvo.ws"
                className="text-foreground hover:text-extra-peach transition-colors duration-200 flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-extra-peach/10"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Globe className="h-4 w-4 mr-1" />
                <span className="text-sm">IndieWeb 🕸💍</span>
              </a>

              <a
                href="https://xn--sr8hvo.ws/next"
                className="text-foreground hover:text-extra-peach transition-colors duration-200 p-2 rounded-full hover:bg-extra-peach/10"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Next site in IndieWeb Webring"
              >
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </motion.div>

          {/* Bucketfish Webring */}
          <motion.div
            variants={itemVariants}
            className="group relative bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-2 border-extra-yellow/30 dark:border-extra-yellow/10 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-extra-yellow/10 dark:bg-extra-yellow/5 rounded-full blur-2xl group-hover:bg-extra-yellow/20 transition-all duration-500"></div>

            <h2 className="text-xl font-medium mb-3 flex items-center">
              <a
                href="https://webring.bucketfish.me"
                className="text-extra-peach hover:text-extra-peach/80 inline-flex items-center gap-1 group/link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Bucketfish Webring
                <ArrowUpRight className="h-4 w-4 opacity-70 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
              </a>
            </h2>
            <p className="mb-6 text-sm text-foreground/80 dark:text-foreground/70">
              A collection of personal websites and creative spaces from around
              the web.
            </p>

            <div className="flex items-center justify-between mt-4 border-t border-extra-yellow/20 dark:border-extra-yellow/10 pt-4">
              <a
                href="https://webring.bucketfish.me/redirect.html?to=prev&name=Lily's Lab"
                className="text-foreground hover:text-extra-peach transition-colors duration-200 p-2 rounded-full hover:bg-extra-peach/10"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Previous site in Bucketfish Webring"
              >
                <ArrowLeft className="h-5 w-5" />
              </a>

              <a
                href="https://webring.bucketfish.me/redirect.html?to=random&name=Lily's Lab"
                className="text-foreground hover:text-extra-peach transition-colors duration-200 flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-extra-peach/10"
                target="_blank"
                rel="noopener noreferrer"
              >
                <CircleDot className="h-4 w-4 mr-1" />
                <span className="text-sm">Random</span>
              </a>

              <a
                href="https://webring.bucketfish.me/redirect.html?to=next&name=Lily's Lab"
                className="text-foreground hover:text-extra-peach transition-colors duration-200 p-2 rounded-full hover:bg-extra-peach/10"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Next site in Bucketfish Webring"
              >
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </motion.div>

          {/* CSS JOY */}
          <motion.div
            variants={itemVariants}
            className="group relative bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-2 border-extra-steelBlue/30 dark:border-extra-steelBlue/10 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-extra-steelBlue/10 dark:bg-extra-steelBlue/5 rounded-full blur-2xl group-hover:bg-extra-steelBlue/20 transition-all duration-500"></div>

            <h2 className="text-xl font-medium mb-3 flex items-center">
              <a
                href="https://css-joy.com/"
                className="text-extra-peach hover:text-extra-peach/80 inline-flex items-center gap-1 group/link"
                target="_blank"
                rel="noopener noreferrer"
              >
                CSS JOY
                <ArrowUpRight className="h-4 w-4 opacity-70 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
              </a>
            </h2>
            <p className="mb-6 text-sm text-foreground/80 dark:text-foreground/70">
              A collection of websites celebrating the joy of CSS and creative
              web design.
            </p>

            <div className="flex items-center justify-between mt-4 border-t border-extra-steelBlue/20 dark:border-extra-steelBlue/10 pt-4">
              <a
                href="https://css-joy.com/previous"
                className="text-foreground hover:text-extra-peach transition-colors duration-200 p-2 rounded-full hover:bg-extra-peach/10"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Previous site in CSS JOY"
              >
                <ArrowLeft className="h-5 w-5" />
              </a>

              <a
                href="https://css-joy.com/random"
                className="text-foreground hover:text-extra-peach transition-colors duration-200 flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-extra-peach/10"
                target="_blank"
                rel="noopener noreferrer"
              >
                <CircleDot className="h-4 w-4 mr-1" />
                <span className="text-sm">Random</span>
              </a>

              <a
                href="https://css-joy.com/next"
                className="text-foreground hover:text-extra-peach transition-colors duration-200 p-2 rounded-full hover:bg-extra-peach/10"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Next site in CSS JOY"
              >
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </motion.div>
        </motion.div>

        <footer className="mt-12 flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-border pt-6 text-sm text-muted-foreground">
          <p>Last updated: July 12, 2024</p>
          <div className="flex items-center gap-1.5 mt-3 sm:mt-0">
            <div className="h-2 w-2 rounded-full bg-extra-peach/70"></div>
            <div className="h-2 w-2 rounded-full bg-extra-lavender/70"></div>
            <div className="h-2 w-2 rounded-full bg-extra-yellow/70"></div>
            <div className="h-2 w-2 rounded-full bg-extra-steelBlue/70"></div>
          </div>
        </footer>
      </div>
    </>
  );
}
