import { WebSocketServer } from "ws";

const wss = new WebSocketServer({port: 8080});

class BiMap<K extends string, V extends string> {
	private forward = new Map<K, V>();
	private reverse = new Map<V, K>();

	set(key: K, value: V) {
		const oldValue = this.forward.get(key);
		if (oldValue) {
			this.reverse.delete(oldValue);
		}
		const oldKey = this.reverse.get(value);
		if (oldKey) {
			this.forward.delete(oldKey);
		}
		this.forward.set(key, value);
		this.reverse.set(value, key);
	}

	get(key: K) {
		return this.forward.get(key);
	}

	getKey(value: V) {
		return this.reverse.get(value);
	}

    delete(key: K) {
        const value = this.forward.get(key);
		if (value) {
			this.reverse.delete(value);
			this.forward.delete(key);
		}
    }
}

type Room = {
    roomId: string;
	clients: Map<string, any>;
	playerIds: string[];
    players: BiMap<string, string>;
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
		clients: new Map(),
		playerIds: [playerId],
        players: (() => {
            const p = new BiMap<string, string>();
            p.set(playerId, "Yardmaster");
            return p;
        })(),
		yardmaster: playerId,
		currentTurn: 0,
		ruleCode: null,
		ruleSubmitted: false,
		state: []
	};

	rooms.set(id, room);

	return room;
}

wss.on("connection", (socket) => {
	console.log("client connected");
	let currentRoom: string | null = null;
    let currentPlayerId: string | null = null;

	socket.on("message", (raw) => {
		const msg = JSON.parse(raw.toString());
		console.log("received:", msg);

        // Player creates room
        if(msg.type === "create") {
            const room = createRoom(msg.playerId);
            room.clients.set(msg.playerId, socket);
            currentRoom = room.roomId;
            currentPlayerId = msg.playerId;

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
            currentPlayerId = msg.playerId;
            room.clients.set(msg.playerId, socket);

            let role = "spectator";
            if (msg.playerId === room.yardmaster) {
                role = "yardmaster";
            }
            else if (room.playerIds.includes(msg.playerId)) {
                role = "yarddog";
            }
            else if (!room.ruleSubmitted) {
                role = "yarddog";
                room.players.set(msg.playerId, "Yarddog " + room.playerIds.length);
                room.playerIds.push(msg.playerId);
            }

            console.log(room.players);
            console.log(room.playerIds.map(id => room.players.get(id)));

            socket.send(
                JSON.stringify({
                    type:"joined",
                    role,
                    playerNames: room.playerIds.map(id => room.players.get(id)),
                    state: room.state,
                    ruleSubmitted: room.ruleSubmitted,
                    ruleCode: role === "yardmaster" ? room.ruleCode : null
                })
            );

            broadcast(
                msg.roomId,
                {
                    type:"updated",
                    playerNames: room.playerIds.map(id => room.players.get(id)),
                    state: room.state,
                    ruleSubmitted: room.ruleSubmitted
                }
            );

            return;
        }

        // Player submits rules
        if (msg.type === "rule") {
            const room = rooms.get(msg.roomId);

            if (!room) return;

            if (msg.playerId === room.yardmaster) {
                room.ruleCode = msg.code;
                room.ruleSubmitted = true;
            }

            broadcast(
                msg.roomId,
                {
                    type:"updated",
                    playerNames: room.playerIds.map(id => room.players.get(id)),
                    state: room.state,
                    ruleSubmitted: room.ruleSubmitted
                }
            );

            return;
        }

        // Player yields rule
        if (msg.type === "yield") {
            const room = rooms.get(msg.roomId);

            if (!room) return;

            const newYardmaster = room.players.getKey(msg.playerName)

            if (msg.playerId === room.yardmaster && newYardmaster) {
                room.yardmaster = newYardmaster;
                
                socket.send(
                    JSON.stringify({
                        type:"joined",
                        role:"yarddog",
                        playerNames: room.playerIds.map(id => room.players.get(id)),
                        state: room.state,
                        ruleSubmitted: room.ruleSubmitted,
                        ruleCode: null
                    })
                );
                
                room.clients.get(newYardmaster).send(
                    JSON.stringify({
                        type:"joined",
                        role:"yardmaster",
                        playerNames: room.playerIds.map(id => room.players.get(id)),
                        state: room.state,
                        ruleSubmitted: room.ruleSubmitted,
                        ruleCode: null
                    })
                );
            }
        }

        // Player switches to spectator
        if (msg.type === "spectate") {
            const room = rooms.get(msg.roomId);

            if (!room) return;

            if (room.playerIds.includes(msg.playerId)) {
                room.playerIds = room.playerIds.filter(id => id !== msg.playerId);
                room.players.delete(msg.playerId);

                socket.send(
                    JSON.stringify({
                        type:"joined",
                        role:"spectator",
                        playerNames: room.playerIds.map(id => room.players.get(id)),
                        state: room.state,
                        ruleSubmitted: room.ruleSubmitted,
                        ruleCode: null
                    })
                );

                broadcast(
                    msg.roomId,
                    {
                        type:"updated",
                        playerNames: room.playerIds.map(id => room.players.get(id)),
                        state: room.state,
                        ruleSubmitted: room.ruleSubmitted
                    }
                );
            }
        }

        // Player switches to yarddog
        if (msg.type === "yarddog") {
            const room = rooms.get(msg.roomId);

            if (!room) return;

            if (!room.playerIds.includes(msg.playerId)) {
                room.players.set(msg.playerId, "Yarddog " + room.playerIds.length);
                room.playerIds.push(msg.playerId);

                socket.send(
                    JSON.stringify({
                        type:"joined",
                        role:"yarddog",
                        playerNames: room.playerIds.map(id => room.players.get(id)),
                        state: room.state,
                        ruleSubmitted: room.ruleSubmitted,
                        ruleCode: null
                    })
                );

                broadcast(
                    msg.roomId,
                    {
                        type:"updated",
                        playerNames: room.playerIds.map(id => room.players.get(id)),
                        state: room.state,
                        ruleSubmitted: room.ruleSubmitted
                    }
                );
            }
        }

        // Player changes name
        if (msg.type === "change") {
            const room = rooms.get(msg.roomId);

            if (!room) return;

            if (!Object.values(room.players).includes(msg.playerName) && ~msg.playerName.startsWith("Yarddog")) {
                room.players.set(msg.playerId, msg.playerName);
            } else {
                console.log("Rejected duplicate name");
            }

            broadcast(
                msg.roomId,
                {
                    type:"updated",
                    playerNames: room.playerIds.map(id => room.players.get(id)),
                    state: room.state,
                    ruleSubmitted: room.ruleSubmitted
                }
            );
        }

		// Player plays a card
		if (msg.type === "play") {
            const room = rooms.get(msg.roomId);

            if (!room) return;

            const currentPlayer = room.playerIds[room.currentTurn];
            
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

            room.currentTurn = (room.currentTurn + 1) % room.playerIds.length;

            return;
        }
	});

	socket.on("close", () => {
        console.log("client disconnected");

        if (currentRoom) {
            const room = rooms.get(currentRoom);
            room?.clients.delete(currentPlayerId);
        }
    });

});

function broadcast(
	roomId: string,
	message: any
) {
	const room = rooms.get(roomId);

	if (!room) return;

	for (const client of room.clients.values()) {
		client.send(JSON.stringify(message));
	}
}
