'use client';
import { TextEffect } from '@/components/core/text-effect';
import React from 'react';
import { motion } from 'framer-motion';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import { AppleCardsCarouselDemo } from '@/components/CardsDemo';

import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

const Home = () => {
	const tasks = useQuery(api.tasks.get);

	return (
		<ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
			<Toaster position="bottom-center" richColors />
			<div className="w-full overflow-hidden fc justify-between pt-36 bg-black text-foreground px-5 sm:px-10 gap-24">
				<div className="max-w-6xl w-full mx-auto fc justify-start h-full">
					<TextEffect
						className="relative z-10 text-4xl md:text-7xl tracking-tight text-center text-orange-500 font-sans font-bold mb-2"
						per="word"
						as="h3"
						preset="blur"
					>
						There is an easier way to learn a language
					</TextEffect>
					<motion.p
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5 }}
						className="text-center text-sm md:text-2xl max-w-xl mx-auto  mb-10"
					>
						<br className="hidden sm:block" /> RealTalk is an AI-powered language learning platform that helps you learn a new language
						faster and more effectively.
					</motion.p>
				</div>
				<AppleCardsCarouselDemo />
			</div>
		</ThemeProvider>
	);
};

export default Home;
