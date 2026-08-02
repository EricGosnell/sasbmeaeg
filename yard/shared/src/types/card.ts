export type Suit = 'Spades' | 'Hearts' | 'Diamonds' | 'Clubs' | 'Joker';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'Joker1' | 'Joker2';
export type Color = 'Red' | 'Black';

export interface CardData {
	suit: Suit;
	rank: Rank;
	color: Color;
	isFace: boolean;
	isRotationallySymmetric: boolean;
}