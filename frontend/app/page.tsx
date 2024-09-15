'use client';
import { TextEffect } from "@/components/core/text-effect";
import { React, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { AppleCardsCarouselDemo } from "@/components/CardsDemo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// particles
import Particles, { initParticlesEngine } from "@tsparticles/react";
import {
  Background,
  type Container,
  type ISourceOptions,
  MoveDirection,
  OutMode,
} from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

const Home = () => {
  const [init, setInit] = useState(false);

  const gradient = {
    background: 'hsla(195, 48%, 51%, 1)',
    background: 'linear-gradient(270deg, hsla(195, 48%, 51%, 1) 0%, hsla(229, 91%, 9%, 1) 26%)',
    background: '-moz-linear-gradient(270deg, hsla(195, 48%, 51%, 1) 0%, hsla(229, 91%, 9%, 1) 26%)',
    background: '-webkit-linear-gradient(270deg, hsla(195, 48%, 51%, 1) 0%, hsla(229, 91%, 9%, 1) 26%)',
    filter: 'progid: DXImageTransform.Microsoft.gradient( startColorstr="#46A0BE", endColorstr="#020A2D", GradientType=1 )'
  }

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    console.log(container);
  };

  // Calculate particle density based on scroll position
  const calculateDensity = () => {
    // Example calculation based on scroll position
    const scrollY = window.scrollY || 0;
    const windowHeight = window.innerHeight || 1;
    const maxDensity = 500; // Maximum density at the top
    const minDensity = 100; // Minimum density at the bottom
    const density = Math.max(
      minDensity,
      maxDensity - (scrollY / windowHeight) * (maxDensity - minDensity)
    );
    return density;
  };

  const options: ISourceOptions = useMemo(
    () => ({
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "push",
          },
          onHover: {
            enable: true,
            mode: "grab",
          },
        },
        modes: {
          push: {
            quantity: 4,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: "#ffffff",
        },
        links: {
          color: "#ffffff",
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1,
        },
        move: {
          direction: MoveDirection.none,
          enable: true,
          outModes: {
            default: OutMode.out,
          },
          random: false,
          speed: 2,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            value: calculateDensity(), // Dynamically calculate density
          },
          value: 500,
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 5 },
        },
      },
      detectRetina: true,
    }),
    [calculateDensity]
  );

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <Toaster position="bottom-center" richColors />
      <div className="w-full fc justify-between pt-12 text-foreground px-5 sm:px-10 gap-24 h-screen" style={gradient}>
        <div className="overflow-hidden w-full">
          <Particles
            id="tsparticles"
            particlesLoaded={particlesLoaded}
            options={options}
            className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-80 w-full z-10 m-0 p-0"
          />
        </div>
        <motion.div className="max-w-6xl w-full mx-auto fc h-full">

          <TextEffect
            className="relative z-10 text-4xl md:text-7xl tracking-tight text-center text-orange-500 font-sans font-bold mb-2 pt-24"
            per="word"
            as="h3"
            preset="blur"
          >
            There is an easier way to learn a language
          </TextEffect>
          <Link href="/review" className="pt-7">
            <Button variant="secondary">Get started</Button>
          </Link>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center text-sm md:text-2xl max-w-xl mx-auto mt-5"
          >
            <br className="hidden sm:block" /> RealTalk is an AI-powered
            language learning platform that helps you learn a new language
            faster and more effectively.
          </motion.p>
        </motion.div>
        <div className="w-full" style={{ background: "rgb(2, 10, 44)" }}>
        <AppleCardsCarouselDemo />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Home;
