import { json } from "@sveltejs/kit";
import { rooms } from "$lib/server/rooms";


export async function POST({params, request}) {

	const {
		player,
		code
	} = await request.json();


	const room = rooms.get(params.id);


	if (!room) {
		return json(
			{error:"Room not found"},
			{status:404}
		);
	}


	const p = room.players.find(
		p => p.id === player
	);


	if (!p || p.role !== "yardmaster") {
		return json(
			{error:"Not allowed"},
			{status:403}
		);
	}


	room.ruleSubmitted = true;
    room.ruleCode = code;


	return json({
		success:true
	});
}