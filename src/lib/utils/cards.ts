import type { CardData, Rank, Suit } from '$lib/types/card';

const suits: Suit[] = ['S', 'H', 'D', 'C'];
const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'J', 'Q', 'K'];

export function generateDeck(): CardData[] {
	return suits.flatMap((suit) => ranks.map((rank) => ({ suit, rank })));
}

export function cardImage(rank: Rank, suit: Suit) {
	return `https://deckofcardsapi.com/static/img/${rank}${suit}.png`;
}

export const cardBack = 'https://deckofcardsapi.com/static/img/back.png';
