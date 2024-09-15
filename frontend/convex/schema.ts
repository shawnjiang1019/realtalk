import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
	decks: defineTable({
		description: v.string(),
		name: v.string(),
	}),
	flashcards: defineTable({
		answer: v.string(),
		deck_id: v.id('decks'),
		question: v.string(),
		context: v.string(),
		lang_from: v.string(),
		lang_to: v.string(),
	}),

	memories: defineTable({
		native: v.string(),
		foreign: v.string(),
		transcript: v.string(),
	}),
});
