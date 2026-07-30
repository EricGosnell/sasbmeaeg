import { json } from "@sveltejs/kit";
import { rooms } from "$lib/server/rooms";


export async function POST({ params, request }) {

	const {
        player,
        card,
        good
	} = await request.json();


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

	const playerIndex =
		room.players.findIndex(
			p => p.id === player
		);
        
    if (!room.ruleSubmitted && !playerIndex) {
        return json(
            {
                error:"Yardmaster must submit rules first"
            },
            {
                status:403
            }
        );
    }


	if (playerIndex === -1) {
		return json(
			{
				error:"Unknown player"
			},
			{
				status:403
			}
		);
	}


	// check turn
	if (playerIndex !== room.currentTurn) {
		return json(
			{
				error:"Not your turn"
			},
			{
				status:403
			}
		);
	}


	// add card
	if (good !== null) {

        room.state.push({
            ...card,
            good
        });

    }
    else {

        room.pendingPlay = {
            playerId: player,
            card
        };

    }


	// next player
	room.currentTurn =
		(room.currentTurn + 1)
		% room.players.length;


	return json({
		success:true,
		state:room.state
	});
}