import type { CardData } from "./card";


export type ClientMessage =
	| {
			type:"create";
			playerId:string;
	  }
	| {
			type: "join";
			roomId: string;
			playerId: string;
	  }
	| {
			type: "rule";
			roomId: string;
			playerId: string;
			code: string;
	  }
	| {
			type: "play";
			roomId: string;
			playerId: string;
			card: CardData;
	  };


export type ServerMessage =
	| {
			type: "created";
			roomId: string;
	}
	| {
			type: "joined";
			role: string;
			state: CardData[];
	// TODO		
	}
	| {
			type: "validated";
			card: CardData;
			good: boolean;
	  };