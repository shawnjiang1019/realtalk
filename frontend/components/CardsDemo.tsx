'use client';
import React from 'react';
import { Carousel, Card } from '@/components/cards-carousel';

export function AppleCardsCarouselDemo() {
	const cards = data.map((card, index) => <Card key={card.src} card={card} index={index} />);

	return (
		<div className="w-full">
			<h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-foreground font-sans">Get to know RealTalk.</h2>
			<Carousel items={cards} />
		</div>
	);
}

const data = [
	{
		category: 'AI-Powered Flashcards',
		title: 'Generate Flashcards with AI',
		src: 'https://images.unsplash.com/photo-1639004643579-7286ae5a771d?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		content: 'An AI icon with gears and a brain, symbolizing the automated generation of flashcards from various inputs like PDFs and videos.',
	},
	{
		category: 'Import',
		title: 'Import Flashcards from PDF using AI',
		src: 'https://images.unsplash.com/photo-1604882737321-e6937fd6f519?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		content: 'A document being scanned or converted on a computer screen, representing the ability to import flashcards from PDFs.',
	},
	{
		category: 'Text Input',
		title: 'Use AI to Create Flashcards from Text',
		src: 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		content:
			'A text editor on a computer screen, with text being converted into flashcards, symbolizing the feature to create flashcards directly from text input.',
	},
	// flashcards from Youtube video
	{
		category: 'Video Input',
		title: 'Create Flashcards from YouTube Videos',
		src: 'https://images.unsplash.com/photo-1551817958-11e0f7bbea9c?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		content:
			'A YouTube video being played on a computer screen, with the video content being converted into flashcards, representing the feature to create flashcards from video input.',
	},
	{
		category: 'Manual Creation',
		title: 'Create Flashcards Manually',
		src: '/fs.jpg',
		content: 'A clean desk with stationery like index cards, pens, and sticky notes, indicating the manual creation of flashcards.',
	},
	{
		category: 'Organize',
		title: 'Organize Flashcards into Folders',
		src: 'https://images.unsplash.com/photo-1504386106331-3e4e71712b38?q=80&w=2333&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		content:
			'A set of neatly organized folders on a desktop, with labels for different subjects or topics, representing the organization of flashcards into folders.',
	},
	{
		category: 'Review',
		title: 'Review Your Flashcards',
		src: 'https://images.unsplash.com/photo-1593698054469-2bb6fdf4b512?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		content: 'An open flashcard app on a tablet, with a person reviewing cards, symbolizing the ease of reviewing flashcards anytime, anywhere.',
	},
];
