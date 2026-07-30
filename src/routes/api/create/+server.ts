import { json } from "@sveltejs/kit";
import { createRoom } from "$lib/server/rooms";


export function POST() {

	const playerId =
		crypto.randomUUID();


	const room =
		createRoom(playerId);


	return json({
		roomId: room.id,
		playerId,
		role: "yardmaster"
	});
}