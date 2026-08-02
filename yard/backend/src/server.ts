import { WebSocketServer } from "ws";

const wss = new WebSocketServer({port: 8080});

type Room = {
    roomId: string;
	clients: Set<any>;
	players: string[];
	yardmaster: string | null;
	currentTurn: number;
	state: any[];
	ruleCode: string | null;
	ruleSubmitted: boolean;
};

const rooms = new Map<string, Room>();

function createRoom(playerId:string) {
	const id = Math.random().toString(36).substring(2,8);
	const room:Room = {
        roomId: id,
		clients:new Set(),
		players:[playerId],
		yardmaster: playerId,
		currentTurn:0,
		ruleCode:null,
		ruleSubmitted:false,
		state:[]
	};

	rooms.set(id, room);

	return room;
}

wss.on("connection", (socket) => {
	console.log("client connected");
	let currentRoom: string | null = null;

	socket.on("message", (raw) => {
		const msg = JSON.parse(raw.toString());
		console.log("received:", msg);

        // Player creates room
        if(msg.type === "create") {
            const room = createRoom(msg.playerId);
            room.clients.add(socket);
            currentRoom = room.roomId;

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
            const room = rooms.get(msg.roomId);

            if (!room) {
                socket.send(
                    JSON.stringify({
                        type:"error",
                        message:"Room does not exist"
                    })
                );
                return;
            }

            currentRoom = msg.roomId;
            room.clients.add(socket);

            let role = "spectator";
            if (msg.playerId === room.yardmaster) {
                role = "yardmaster";
            }
            else if (room.players.includes(msg.playerId)) {
                role = "yarddog";
            }
            else if (!room.ruleSubmitted) {
                role = "yarddog";
                room.players.push(msg.playerId);
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
            const room = rooms.get(msg.roomId);

            if (!room) return;

            if (msg.playerId === room.yardmaster) {
                room.ruleCode = msg.code;
                room.ruleSubmitted = true;
            }

            return;
        }

		// Player plays a card
		if (msg.type === "play") {
            const room = rooms.get(msg.roomId);

            if (!room) return;

            const currentPlayer = room.players[room.currentTurn];
            
            if (msg.playerId !== currentPlayer) {
                console.log(
                    "Rejected play from",
                    msg.playerId
                );

                return;
            }

            broadcast(
                msg.roomId,
                {
                    type:"evaluate",
                    playerId:msg.playerId,
                    card:msg.card
                }
            );

            return;
        }

        // Yardmaster validates play
        if (msg.type === "validate") {
            const room = rooms.get(msg.roomId);

            if (!room) return;

            broadcast(
                msg.roomId,
                {
                    type: "validated",
                    card: msg.card,
                    good: msg.good
                }
            );

            room.state.push({
                ...msg.card,
                good: msg.good
            });

            room.currentTurn = (room.currentTurn + 1) % room.players.length;

            return;
        }
	});

	socket.on("close", () => {
        console.log("client disconnected");

        if (currentRoom) {
            const room = rooms.get(currentRoom);
            room?.clients.delete(socket);

        }
    });

});

function broadcast(
	roomId: string,
	message: any
) {
	const room = rooms.get(roomId);

	if (!room) return;

	for (const client of room.clients) {
		client.send(JSON.stringify(message));
	}
}
