'use client';
import { FlashcardArray } from 'react-quizlet-flashcard';
interface Deck {
	title: string;
	description: string;
}

interface Flashcard {
	_id: string;
	question: string;
	answer: string;
}
function Flashcards({ deck, flashcards }: { deck: Deck; flashcards: Flashcard[] }) {
	if (!deck || !flashcards) return null;
	const newCards = flashcards.map((card) => {
		return {
			id: card._id,
			frontHTML: <div className="w-full h-full fc p-5">{card.question}</div>,
			backHTML: <div className="w-full h-full fc p-5">{card.answer}</div>,
		};
	});
	return (
		<div className="fc gap-3 items-start w-full max-w-3xl mt-10">
			<h3 className="text-2xl font-bold">{deck?.title}</h3>
			<p className="text-lg">{deck?.description}</p>
			<button
				// onClick={save}
				className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
			>
				Save to Cardify
			</button>
			<FlashcardArray cards={newCards} />
		</div>
	);
}

export default Flashcards;
