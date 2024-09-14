"use client";
import { TextEffect } from "@/components/core/text-effect";
import React from "react";
import { motion } from "framer-motion";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { AppleCardsCarouselDemo } from "@/components/CardsDemo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Home = () => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <Toaster position="bottom-center" richColors />
      <div className="w-full overflow-hidden fc justify-between pt-12 bg-black text-foreground px-5 sm:px-10 gap-24">
        <motion.div
          // initial={{ opacity: 0, y: 50 }}
          // animate={{ opacity: 1, y: 0 }}
          // transition={{ delay: 0.5 }}
          className="max-w-6xl w-full mx-auto fc h-full"
        >
          <motion.svg
            width="294"
            height="109"
            viewBox="0 0 294 109"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="105"
              y="10.7442"
              width="149.93"
              height="85.4651"
              fill="#F97316"
            />
            <path
              d="M67.6395 10.2558L241.913 2.35994C266.767 1.23384 284.828 25.6711 276.456 49.1005L263.586 85.1203C258.612 99.0432 244.984 107.958 230.234 106.938L71.5465 95.9651C71.5465 95.9651 94.0116 80.8256 94.0116 52.9884C94.0116 25.1512 67.6395 10.2558 67.6395 10.2558Z"
              fill="#F97316"
            />
            <path
              d="M114.03 49.8605L118.981 20.0423H130.745C132.997 20.0423 134.851 20.4403 136.307 21.2362C137.772 22.0321 138.801 23.1629 139.393 24.6286C139.995 26.0846 140.136 27.8026 139.815 29.7827C139.485 31.7628 138.772 33.4614 137.675 34.8786C136.588 36.2957 135.171 37.3877 133.424 38.1545C131.686 38.9116 129.672 39.2902 127.381 39.2902H119.505L120.378 34.2234H127.221C128.425 34.2234 129.454 34.0584 130.308 33.7284C131.162 33.3984 131.837 32.9033 132.332 32.2433C132.837 31.5832 133.167 30.7631 133.322 29.7827C133.487 28.7829 133.429 27.9482 133.147 27.2784C132.866 26.599 132.356 26.0845 131.618 25.7351C130.881 25.376 129.91 25.1964 128.706 25.1964H124.455L120.335 49.8605H114.03ZM132.375 36.2909L137.544 49.8605H130.585L125.576 36.2909H132.375ZM141.177 49.8605L146.127 20.0423H166.219L165.346 25.2401H151.558L150.393 32.3452H163.147L162.274 37.543H149.519L148.355 44.6627H162.201L161.327 49.8605H141.177ZM171.421 49.8605H164.665L179.909 20.0423H188.033L193.362 49.8605H186.607L182.981 26.8562H182.748L171.421 49.8605ZM172.964 38.1399H188.922L188.077 43.0611H172.12L172.964 38.1399ZM196.951 49.8605L201.901 20.0423H208.206L204.129 44.6627H216.912L216.039 49.8605H196.951Z"
              fill="white"
            />
            <path
              d="M109.638 67.1479L110.277 63.3446H128.196L127.557 67.1479H120.877L117.895 85.1628H113.335L116.318 67.1479H109.638ZM128.62 85.1628H123.677L134.831 63.3446H140.775L144.675 85.1628H139.731L137.079 68.3304H136.908L128.62 85.1628ZM129.749 76.5868H141.425L140.807 80.1876H129.131L129.749 76.5868ZM147.301 85.1628L150.923 63.3446H155.536L152.553 81.3595H161.906L161.267 85.1628H147.301ZM164.322 85.1628L167.944 63.3446H172.557L170.97 72.9646H171.257L180.696 63.3446H186.226L176.542 73.1138L182.699 85.1628H177.181L172.728 76.1926L169.979 78.9838L168.935 85.1628H164.322Z"
              fill="white"
            />
            <rect
              x="17.093"
              y="24.907"
              width="57.6279"
              height="60.0698"
              fill="#F97316"
            />
            <circle cx="44.9302" cy="54.2093" r="44.9302" fill="#F97316" />
            <path
              d="M56.1502 59.218C51.0827 57.6183 52.5252 56.3448 57.3615 54.528C59.6781 53.6561 58.2693 51.8174 58.3326 50.3465C58.361 49.6732 61.0083 49.8074 60.8162 47.2103C60.6809 45.3815 56.6522 42.7757 55.5544 41.6637C54.9204 41.0221 56.8464 39.2664 55.49 37.7223C53.6383 35.6119 53.3458 31.94 52.2252 29.8863C52.2252 29.8863 53.0796 28.5813 52.4248 27.8392C46.7768 21.4459 25.7001 22.0329 20.3139 31.4424C14.2675 42.0053 14.1868 56.6045 26.7586 64.4699C32.3499 67.9673 25.1883 80.3525 25.1883 80.3525H47.3606C47.3606 78.2377 44.8879 70.6516 49.2156 70.9921C52.9759 71.2878 57.5808 71.1252 57.1727 66.8782C57.0494 65.5972 56.9042 64.4438 57.799 63.382C58.6938 62.3214 59.9891 60.4292 56.1502 59.218Z"
              fill="white"
            />
            <path
              d="M61.2254 57.2243L81.8176 59.9218V54.528L61.2254 57.2243Z"
              fill="white"
            />
            <path
              d="M77.9547 74.9848L80.1633 70.3134L61.2254 60.0909L77.9547 74.9848Z"
              fill="white"
            />
            <path
              d="M80.1633 44.0873L77.9547 39.4148L61.2254 54.3108L80.1633 44.0873Z"
              fill="white"
            />
          </motion.svg>
          <TextEffect
            className="relative z-10 text-4xl md:text-7xl tracking-tight text-center text-orange-500 font-sans font-bold mb-2 pt-12"
            per="word"
            as="h3"
            preset="blur"
          >
            There is an easier way to learn a language
          </TextEffect>
          <Link href="/review" className="pt-7">
            <Button variant="secondary" className="">
              Get started
            </Button>
          </Link>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center text-sm md:text-2xl max-w-xl mx-auto mb-10"
          >
            <br className="hidden sm:block" /> RealTalk is an AI-powered
            language learning platform that helps you learn a new language
            faster and more effectively.
          </motion.p>
        </motion.div>
        <AppleCardsCarouselDemo />
      </div>
    </ThemeProvider>
  );
};

export default Home;
