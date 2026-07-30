import { json } from "@sveltejs/kit";
import { joinRoom } from "$lib/server/rooms";


export async function POST({request}) {

	const {
		roomId
	} = await request.json();


	const playerId =
		crypto.randomUUID();


	const room =
		joinRoom(
			roomId,
			playerId
		);


	const player =
		room.players.find(
			p => p.id === playerId
		);


	return json({
		roomId,
		playerId,
		role: player?.role
	});
}