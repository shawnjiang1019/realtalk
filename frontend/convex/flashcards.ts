import { query } from './_generated/server';
import { v } from 'convex/values';
import { mutation } from "./_generated/server";

export const get = query({
	args: {},
	handler: async (ctx) => {
		return await ctx.db.query('flashcards').collect();
	},
});

export const getByDeckId = query({
	args: { deck_id: v.id('deck') },
	handler: async (ctx, args) => {
		const flashcards = await ctx.db
			.query('flashcards')
			.filter((q) => q.eq(q.field('deck_id'), args.deck_id))
			.collect();
		return flashcards;
	},
});



export const createCard = mutation({
	args: { question: v.string() },
	handler: async (ctx, args) => {
	  const taskId = await ctx.db.insert("flashcards", { question: args.question });
	  // do something with `taskId`
	},
  });