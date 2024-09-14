'use client';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import Link from 'next/link';
import React from 'react';

const Review = () => {
	const decks = useQuery(api.deck.get);
	console.log(decks);

	return (
		<div className="w-full overflow-hidden fc justify-between pt-36 bg-black text-foreground px-5 sm:px-10 gap-24">
			<h1 className="text-4xl font-bold">Review</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
				{decks &&
					decks?.map((deck) => (
						<Link href={`/review/${deck._id}`} key={deck._id} className="bg-neutral-800 rounded-lg p-5 fc items-start gap-2">
							<h2 className="text-xl font-bold">{deck.name}</h2>
							<p>{deck.description}</p>
						</Link>
					))}
			</div>
		</div>
	);
};

export default Review;
