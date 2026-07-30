type Card = {
	rank: string;
	suit: string;
	good?: boolean;
};

type Player = {
	id: string;
	role: "yardmaster" | "yarddog" | "spectator";
};

type Room = {
	id: string;
	players: Player[];
	state: Card[];

	ruleSubmitted: boolean;
	currentTurn: number;

	ruleCode: string | null;

	pendingPlay: {
		playerId: string;
		card: Card;
	} | null;
};

export const rooms = new Map<string, Room>();

function randomId() {
	return Math.random()
		.toString(36)
		.substring(2, 8);
}

export function createRoom(playerId: string) {

	const id = randomId();

	const room: Room = {
		id,
		players: [
			{
				id: playerId,
				role: "yardmaster"
			}
		],
		state: [],
		ruleSubmitted: false,
		currentTurn: 0,
		ruleCode: null,
		pendingPlay: null
	};

	rooms.set(id, room);

	return room;
}


export function joinRoom(
	roomId: string,
	playerId: string
) {

	const room = rooms.get(roomId);

	if (!room)
		throw new Error("Room does not exist");


	let role: Player["role"] = "spectator";


	if (!room.ruleSubmitted) {

		const dogs =
			room.players.filter(
				p => p.role === "yarddog"
			);

		if (dogs.length < 2) {
			role = "yarddog";
		}
	}


	room.players.push({
		id: playerId,
		role
	});


	return room;
}