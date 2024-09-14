import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
	deck: defineTable({
		description: v.string(),
		name: v.string(),
	}),
	flashcards: defineTable({
		answer: v.string(),
		deck_id: v.id('deck'),
		question: v.string(),
	}),
});
