import { query } from './_generated/server';
import { v } from 'convex/values';

export const get = query({
	args: {},
	handler: async (ctx) => {
		return await ctx.db.query('memories').collect();
	},
});

export const getByDeckId = query({
	args: { id: v.id('memories') },
	handler: async (ctx, args) => {
		const flashcards = await ctx.db
			.query('memories')
			.filter((q) => q.eq(q.field('_id'), args.id))
			.collect();
		return flashcards;
	},
});
