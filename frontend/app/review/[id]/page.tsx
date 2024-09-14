'use client';
import Flashcards from '@/components/flashcards';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { FlashcardArray } from 'react-quizlet-flashcard';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Review = ({ params }: { params: { id: string } }) => {
	const { id } = params;
	const flashcards = useQuery(api.flashcards.getByDeckId, { deck_id: id as Id<'deck'> });
	const deck = useQuery(api.deck.getById, { id: id as Id<'deck'> });
	console.log(deck);
	console.log(flashcards);
	// const [flashcards, setFlashcards] = useState(null);

	const [loading, setLoading] = useState(true);
	const [transformedCards, setTransformedCards] = useState(null);

	useEffect(() => {
		if (!deck) {
			toast.error('Failed to get deck');
		}
		if (flashcards) {
			// transform to FlashcardsResponse
			if (!flashcards) return;
			const newCards = flashcards.map((card) => {
				return {
					id: card._id,
					frontHTML: <div className="w-full h-full fc p-5">{card.question}</div>,
					backHTML: <div className="w-full h-full fc p-5">{card.answer}</div>,
				};
			});

			console.log(newCards);
			setTransformedCards(newCards);
			setLoading(false);
		}
	}, [id, deck, flashcards]);

	const controlRef = useRef({}); // {} should definitely be passed to useRef for it to work
	const currentCardFlipRef = useRef(); // nothing should be passed to useRef for it to work
	const [currentCard, setCurrentCard] = useState(1);

	// add keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === 'ArrowRight') {
				controlRef.current.nextCard();
			}
			if (e.key === 'ArrowLeft') {
				controlRef.current.prevCard();
			}
			if (e.key === ' ') {
				e.preventDefault();
				currentCardFlipRef.current();
			}
		};
		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [controlRef, currentCardFlipRef]);

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="w-full overflow-hidden fc justify-between pt-36 bg-black text-foreground px-5 sm:px-10 gap-24">
			{!deck && <div className="w-full h-full fc items-center justify-center">No deck found</div>}
			{deck && !flashcards && <div className="w-full h-full fc items-center justify-center">No flashcards found</div>}
			{deck && flashcards && (
				<>
					<div className="fc items-start gap-2 mb-10 w-full">
						<h2 className="text-3xl font-bold fr gap-2 justify-start">
							<Button size="icon" onClick={() => window.history.back()}>
								<ArrowLeft />
							</Button>
							{deck?.name}
						</h2>
						<p>{deck?.description}</p>
					</div>
					<div className="fc gap-3 w-full px-10 max-w-[800px]">
						{transformedCards && (
							<div
								className="cursor-pointer select-none w-full"
								onClick={() => {
									currentCardFlipRef.current();
								}}
							>
								<FlashcardArray
									FlashcardArrayStyle={{
										fontSize: '2rem',
										cursor: 'pointer',
										width: '100%',
									}}
									frontCardStyle={{
										backgroundColor: '#1a202c',
										color: '#fff',
										cursor: 'pointer',
									}}
									backCardStyle={{
										backgroundColor: '#1a202c',
										color: '#fff',
										cursor: 'pointer',
									}}
									cards={transformedCards}
									controls={false}
									showCount={false}
									forwardRef={controlRef}
									currentCardFlipRef={currentCardFlipRef}
									onCardChange={(id, index) => {
										setCurrentCard(index);
									}}
								/>
							</div>
						)}
						<div className="fc">
							<p>
								{currentCard} / {flashcards.length}
							</p>
							<div className="fr gap-5 mt-4">
								<button onClick={() => controlRef.current.prevCard()}>
									<ArrowLeft />
								</button>
								<button onClick={() => controlRef.current.nextCard()}>
									<ArrowRight />
								</button>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default Review;
