import { query } from './_generated/server';
import { v } from 'convex/values';

export const get = query({
	args: {},
	handler: async (ctx) => {
		return await ctx.db.query('deck').collect();
	},
});

export const getById = query({
	args: { id: v.id('deck') },
	handler: async (ctx, args) => {
		const deck = await ctx.db.get(args.id);
		return deck;
		// do something with `task`
	},
});
