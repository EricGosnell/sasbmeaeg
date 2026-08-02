import type { CardData, Rank, Suit, Color } from '../types/card';

const suits: Suit[] = ['Spades', 'Hearts', 'Diamonds', 'Clubs'];
const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const suitCode: Record<Suit, string> = {
	Spades: 'S',
	Hearts: 'H',
	Diamonds: 'D',
	Clubs: 'C',
	Joker: ''
};

const suitColor: Record<Suit, Color> = {
	Spades: 'Black',
	Clubs: 'Black',
	Hearts: 'Red',
	Diamonds: 'Red',
	Joker: 'Black'
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

export function generateDeck(includeJokers = false): CardData[] {
	const standardCards = suits.flatMap((suit) =>
		ranks.map((rank) => ({
			suit,
			rank,
			color: suitColor[suit],
			isFace: isFace(rank),
			isRotationallySymmetric: isRotationallySymmetric(suit, rank)
		}))
	);

	if (!includeJokers) return standardCards;

	const jokers: CardData[] = [
		{ suit: 'Joker', rank: 'Joker1', color: 'Black', isFace: false, isRotationallySymmetric: false },
		{ suit: 'Joker', rank: 'Joker2', color: 'Red', isFace: false, isRotationallySymmetric: false }
	];

	return [...standardCards, ...jokers];
}

export function cardImage(rank: Rank, suit: Suit) {
	if (rank === 'Joker1') return 'https://deckofcardsapi.com/static/img/X1.png';
	if (rank === 'Joker2') return 'https://deckofcardsapi.com/static/img/X2.png';
	const imageRank = rank === '10' ? '0' : rank;
	return `https://deckofcardsapi.com/static/img/${imageRank}${suitCode[suit]}.png`;
}

export const cardBack = 'https://deckofcardsapi.com/static/img/back.png';
