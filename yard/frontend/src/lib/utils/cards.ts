import type { CardData, Rank, Suit, Color } from '../types/card';

const suits: Suit[] = ['Spades', 'Hearts', 'Diamonds', 'Clubs'];
const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const suitCode: Record<Suit, string> = {
	Spades: 'S',
	Hearts: 'H',
	Diamonds: 'D',
	Clubs: 'C'
};

const suitColor: Record<Suit, Color> = {
	Spades: 'Black',
	Clubs: 'Black',
	Hearts: 'Red',
	Diamonds: 'Red'
};

const faceRanks: Rank[] = ['J', 'Q', 'K'];

function isFace(rank: Rank) {
	return faceRanks.includes(rank);
}

const rotationallySymmetricRanks: Rank[] = ['2','4','10','J','Q','K']

function isRotationallySymmetric(suit: Suit, rank: Rank) {
	if (rotationallySymmetricRanks.includes(rank)) return true;
	return suit == "Diamonds" && rank != '7';

}

export function generateDeck(): CardData[] {
	return suits.flatMap((suit) =>
		ranks.map((rank) => ({
			suit,
			rank,
			color: suitColor[suit],
			isFace: isFace(rank),
			isRotationallySymmetric: isRotationallySymmetric(suit, rank)
		}))
	);
}

export function cardImage(rank: Rank, suit: Suit) {
	return `https://deckofcardsapi.com/static/img/${rank}${suitCode[suit]}.png`;
}

export const cardBack = 'https://deckofcardsapi.com/static/img/back.png';