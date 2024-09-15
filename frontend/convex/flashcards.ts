import { query } from './_generated/server';
import { v } from 'convex/values';

export const get = query({
	args: {},
	handler: async (ctx) => {
		return await ctx.db.query('flashcards').collect();
	},
});

export const getByDeckId = query({
	args: { deck_id: v.id('decks') },
	handler: async (ctx, args) => {
		const flashcards = await ctx.db
			.query('flashcards')
			.filter((q) => q.eq(q.field('deck_id'), args.deck_id))
			.collect();
		return flashcards;
	},
});
