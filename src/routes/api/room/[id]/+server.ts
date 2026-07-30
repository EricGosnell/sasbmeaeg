import { json } from "@sveltejs/kit";
import { rooms } from "$lib/server/rooms";


export function GET({ params, url }) {

	const room = rooms.get(params.id);


	if (!room) {
		return json(
			{
				error: "Room not found"
			},
			{
				status: 404
			}
		);
	}


	const playerId =
		url.searchParams.get("player");


	const player =
		room.players.find(
			p => p.id === playerId
		);


	return json({
		state: room.state,
		players: room.players,
		role: player?.role,
		pendingPlay: room.pendingPlay
	});
}