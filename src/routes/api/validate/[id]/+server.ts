import { json } from "@sveltejs/kit";
import { rooms } from "$lib/server/rooms";


export async function POST({params, request}) {

	const {
		player,
		good
	} = await request.json();


	const room =
		rooms.get(params.id);


	if (!room)
		return json(
			{},
			{status:404}
		);


	const user =
		room.players.find(
			p => p.id === player
		);


	if (!user || user.role !== "yardmaster")
		return json(
			{},
			{status:403}
		);


	if (!room.pendingPlay)
		return json({
			success:false
		});


	room.state.push({
		...room.pendingPlay.card,
		good
	});


	room.pendingPlay = null;


	return json({
		success:true
	});
}