import { WebSocketServer } from "ws";

const wss = new WebSocketServer({
	port: 8080
});


type Room = {
    roomId: string;
	clients: Set<any>;
	players: string[];
    roles: Map<
		string,
		"yardmaster" | "yarddog" | "spectator"
	>;
	yardmaster: string | null;
	currentTurn: number;

	state: any[];

	ruleCode: string | null;
	ruleSubmitted: boolean;

	pendingPlay?: {
		playerId: string;
		card: any;
	};
};

const rooms = new Map<string, Room>();


function randomId() {

	return Math.random()
		.toString(36)
		.substring(2,8);

}

function createRoom(playerId:string) {

	const id =
		randomId();


	const room:Room = {

        roomId: id,

		clients:new Set(),

		players:[],

		roles:new Map([
			[
				playerId,
				"yardmaster"
			]
		]),

		yardmaster:
			playerId,

		currentTurn:0,

		ruleCode:null,

		ruleSubmitted:false,

		state:[]

	};


	rooms.set(
		id,
		room
	);


	return room;

}

console.log("WebSocket server running on port 8080");


wss.on("connection", (socket) => {

	console.log("client connected");


	let currentRoom: string | null = null;


	socket.on("message", (raw) => {

		const msg = JSON.parse(
			raw.toString()
		);


		console.log(
			"received:",
			msg
		);


        // Player creates room
        if(msg.type === "create") {

            const room =
                createRoom(
                    msg.playerId
                );


            room.clients.add(socket);

            currentRoom =
                room.roomId;

            socket.send(
                JSON.stringify({
                    type:"created",
                    roomId:room.roomId,
                    role:"yardmaster"
                })
            );


            return;

        }

		// Player joins room
		if (msg.type === "join") {

            const room =
                rooms.get(msg.roomId);


            if (!room) {

                socket.send(
                    JSON.stringify({
                        type:"error",
                        message:"Room does not exist"
                    })
                );

                return;

            }


            currentRoom =
                msg.roomId;


            room.clients.add(socket);


            let role =
                room.roles.get(
                    msg.playerId
                );


            // Existing player reconnecting
            if (!role) {


                if (
                    msg.playerId === room.yardmaster
                ) {

                    role = "yardmaster";

                }
                else {

                    role = "yarddog";


                    if (
                        !room.players.includes(
                            msg.playerId
                        )
                    ) {

                        room.players.push(
                            msg.playerId
                        );

                    }

                }


                room.roles.set(
                    msg.playerId,
                    role
                );

            }


            socket.send(
                JSON.stringify({
                    type:"joined",
                    role,
                    state:room.state,
                    ruleSubmitted:
                        room.ruleSubmitted,
                    ruleCode:
                        role === "yardmaster"
                            ? room.ruleCode
                            : null
                })
            );


            return;

        }

        if (msg.type === "rule") {

            const room =
                rooms.get(msg.roomId);


            if (!room)
                return;


            if (
                msg.playerId !== room.yardmaster
            )
                return;


            room.ruleCode =
                msg.code;


            room.ruleSubmitted =
                true;


            return;
        }

		// Player plays a card
		if (msg.type === "play") {

            const room =
                rooms.get(msg.roomId);


            if (!room)
                return;


            const currentPlayer =
                room.currentTurn === 0
                    ? room.yardmaster
                    : room.players[
                        room.currentTurn - 1
                    ];


            console.log("room.players: ", room.players);
            console.log("room.yardmaster: ", room.yardmaster);
            console.log("currentPlayer: ", currentPlayer);
            console.log("room.currentTurn: ", room.currentTurn);
            
            if (
                msg.playerId !== currentPlayer
            ) {

                console.log(
                    "Rejected play from",
                    msg.playerId
                );

                return;

            }


            room.pendingPlay = {
                playerId: msg.playerId,
                card: msg.card
            };


            broadcast(
                msg.roomId,
                {
                    type:"pending_play",
                    playerId:msg.playerId,
                    card:msg.card
                }
            );


            return;

        }

        // Yardmaster validates play
        if (msg.type === "validate") {

            console.log(
                "VALIDATION RECEIVED:",
                msg.good
            );

            const room =
                rooms.get(msg.roomId);


            if (!room)
                return;


            broadcast(
                msg.roomId,
                {
                    type: "result",
                    card: room.pendingPlay?.card,
                    good: msg.good
                }
            );

            if(room.pendingPlay){

                room.state.push({
                    ...room.pendingPlay.card,
                    good: msg.good
                });

            }


            room.pendingPlay = undefined;

            room.currentTurn =
                (room.currentTurn + 1)
                % (room.players.length + 1);


            return;

        }
	});



	socket.on("close", () => {

        console.log(
            "client disconnected"
        );


        if (currentRoom) {

            const room =
                rooms.get(currentRoom);


            room?.clients.delete(socket);

        }

    });

});



function broadcast(
	roomId: string,
	message: any
) {

	const room =
		rooms.get(roomId);


	if (!room)
		return;


	for (const client of room.clients) {

		client.send(
			JSON.stringify(message)
		);

	}

}