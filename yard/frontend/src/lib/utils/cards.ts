import type { CardData, Rank, Suit } from '../types/card';

const suits: Suit[] = ['Spades', 'Hearts', 'Diamonds', 'Clubs'];
const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const suitCode: Record<Suit, string> = {
	Spades: 'S',
	Hearts: 'H',
	Diamonds: 'D',
	Clubs: 'C'
};

export function generateDeck(): CardData[] {
	return suits.flatMap((suit) => ranks.map((rank) => ({ suit, rank })));
}

export function cardImage(rank: Rank, suit: Suit) {
	return `https://deckofcardsapi.com/static/img/${rank}${suitCode[suit]}.png`;
}

export const cardBack = 'https://deckofcardsapi.com/static/img/back.png';