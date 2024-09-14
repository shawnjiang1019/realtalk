'use client';
import { FlashcardDeck, FlashcardResponse } from '@/app/dashboard/types';
import { FlashcardArray } from 'react-quizlet-flashcard';

import ReactMarkdown from 'react-markdown';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

function Flashcards({ deck }: { deck: FlashcardDeck | null }) {
	const supabase = createClient();
	const router = useRouter();

	const save = async () => {
		if (!deck) return;
		// get user
		const {
			data: { user },
			error: uError,
		} = await supabase.auth.getUser();
		if (uError) {
			console.error(uError);
			toast.error('Failed to get user');
		}

		// create a new deck in the database
		const { data, error } = await supabase.from('decks').insert({
			name: deck.title,
			description: deck.description,
			user_id: user?.id,
		});

		if (error) {
			console.error(error);
			return;
		}
		// data will be null every time
		// fetch deck
		const { data: deckData, error: deckError } = await supabase.from('decks').select('*').order('created_at', { ascending: false }).limit(1);
		if (deckError) {
			console.error(deckError);
			toast.error('Failed to get deck');
			return;
		}
		// create cards for the deck
		const cards = deck.flashcards.map((card) => {
			return {
				question: card.question,
				answer: card.answer,
				deck_id: deckData[0].id,
			};
		});

		// add cards to the database
		const { data: cardData, error: cardError } = await supabase.from('flashcards').insert(cards);
		if (cardError) {
			console.log(cardError);
			toast.error('Failed to add cards');
			return;
		}

		router.push(`/dashboard/review`);
	};
	if (!deck || !deck?.flashcards) return null;
	const newCards = deck.flashcards.map((card) => {
		return {
			id: card.id,
			frontHTML: <ReactMarkdown className="w-full h-full fc p-5">{card.question}</ReactMarkdown>,
			backHTML: <ReactMarkdown className="w-full h-full fc p-5">{card.answer}</ReactMarkdown>,
		};
	});
	return (
		<div className="fc gap-3 items-start w-full max-w-3xl mt-10">
			<h3 className="text-2xl font-bold">{deck?.title}</h3>
			<p className="text-lg">{deck?.description}</p>
			<button
				onClick={save}
				className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
			>
				Save to Cardify
			</button>
			<FlashcardArray cards={newCards} />
		</div>
	);
}

export default Flashcards;
