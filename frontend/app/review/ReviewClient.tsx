'use client';
import { Button } from '@/components/ui/button';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tables } from '@/database.types';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const ReviewClient = ({ user, initialDecks }: { user: User; initialDecks: Tables<'decks'>[] }) => {
	// fetch all flashcards
	const supabase = createClient();
	const [decks, setDecks] = useState<Tables<'decks'>[]>(initialDecks);
	const [dialog, setDialog] = useState(false);

	useEffect(() => {
		const channel = supabase
			.channel('realtime decks')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'decks',
				},
				(payload) => {
					if (payload.eventType === 'DELETE') {
						// filter so that its only the user's chats
						setDecks((prev) => prev.filter((chat) => chat.id !== payload.old.id && chat.user_id === user.id));
						return;
					}
					if (payload.eventType === 'UPDATE') {
						setDecks((prev) => {
							const newChats = [...prev];
							const index = newChats.findIndex((chat) => chat.id === payload.old.id);
							newChats[index] = payload.new;
							return newChats;
						});
						return;
					}
					if (payload.new.user_id !== user.id) return;
					setDecks((prev) => [...prev, payload.new]);
				}
			)
			.subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [supabase]);

	const deleteDeck = async (id: string) => {
		// are you sure dialog?

		const { data, error } = await supabase.from('decks').delete().eq('id', id);

		if (error) {
			console.error(error);
			return;
		}

		toast.success('Deck deleted');
		setDialog(false);
		console.log(data);
	};

	return (
		<div className="w-full">
			<h2 className="text-3xl font-bold fr gap-2 justify-start">Review</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10 items-stretch">
				{decks &&
					decks.map((deck, index) => (
						<>
							<Dialog open={dialog} onOpenChange={(prev) => setDialog(!prev)}>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Are you absolutely sure?</DialogTitle>
										<DialogDescription>This action cannot be undone. This will permanently delete the deck.</DialogDescription>
									</DialogHeader>
									<DialogFooter>
										<Button onClick={() => deleteDeck(deck.id)}>Delete</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
							<ContextMenu key={index}>
								<ContextMenuTrigger>
									<Link
										href={`/dashboard/review/${deck.id}`}
										className="bg-white rounded-lg p-5 items-start h-full fc justify-between border-2 border-neutral-200 transition-colors hover:bg-neutral-200 hover:border-indigo-600"
									>
										<div className="fc justify-start items-start">
											<h3 className="text-lg font-bold">{deck.name}</h3>
											{/* only allow 20 characters in desc */}
											<p className="text-sm">
												{deck?.description && deck?.description?.length > 100
													? deck.description?.slice(0, 100) + '...'
													: deck.description}

												{!deck?.description && 'No description'}
											</p>
										</div>
										<p className="text-xs text-neutral-700 mt-4">
											Created at{' '}
											{new Date(deck.created_at!).toLocaleTimeString('en-US', {
												hour: '2-digit',
												minute: '2-digit',
											})}{' '}
											on {new Date(deck.created_at!).toDateString()}
										</p>
									</Link>
								</ContextMenuTrigger>
								<ContextMenuContent>
									<ContextMenuItem>Profile</ContextMenuItem>
									<ContextMenuItem>Billing</ContextMenuItem>
									<ContextMenuItem>Team</ContextMenuItem>
									<ContextMenuItem className="text-red-500" onClick={() => setDialog(true)}>
										Delete
									</ContextMenuItem>
								</ContextMenuContent>
							</ContextMenu>
						</>
					))}

				{/* if no decks */}
				{decks.length === 0 && (
					<div className="fc gap-2 items-start">
						<h3 className="text-lg font-bold">No decks found</h3>
						<Link href={'/dashboard/create'}>
							<button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
								Create New Deck
							</button>
						</Link>
					</div>
				)}
			</div>
		</div>
	);
};
export default ReviewClient;
