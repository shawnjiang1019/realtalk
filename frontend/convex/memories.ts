import { query, mutation } from './_generated/server';
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

export const insert = mutation({
    args: { native: v.string(), foreign: v.string(), transcript: v.string(), lang_from: v.string(), lang_to: v.string() },
    handler: async (ctx, args) => {
      const memory = await ctx.db.insert("memories", args);
      return memory;
    },
})
