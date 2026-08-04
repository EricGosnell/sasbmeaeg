import { WebSocket, WebSocketServer } from "ws";
import type { CardData } from "@sasbmeaeg/shared/src/types/card.js";
import { generateDeck } from "@sasbmeaeg/shared/src/utils/cards.js";

const wss = new WebSocketServer({port: 8080});

declare module "ws" {
    interface WebSocket {
        roomId?: string;
        playerId?: string;
    }
}

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
    playerNames: BiMap<string, string>;
    playerRoles: Map<string, string>;
    playerCards: Map<string, CardData[]>;
    deck: CardData[];
	yardmaster: string;
	currentTurn: number;
	state: any[];
	ruleCode: string | null;
	ruleSubmitted: boolean;
};

const rooms = new Map<string, Room>();

function createRoom(playerId:string) {
	const id = Math.random().toString(36).substring(2,8);
	const room: Room = {
        roomId: id,
		clients: new Map(),
		playerIds: [playerId],
        playerNames: (() => {
            const p = new BiMap<string, string>();
            p.set(playerId, "Yardmaster");
            return p;
        })(),
        playerRoles: new Map([
            [playerId, "yardmaster"]
        ]),
        playerCards: new Map(),
        deck: [],
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

	socket.on("message", (raw) => {
		const msg = JSON.parse(raw.toString());

        const room = msg.type === 'create'
            ? createRoom(msg.playerId)
            : rooms.get(msg.roomId);

        if (!room) {
            socket.send(
                JSON.stringify({
                    type: "error",
                    message: "Room does not exist"
                })
            );
            return;
        }

        socket.roomId = room.roomId;
        socket.playerId = msg.playerId;

        switch (msg.type) {
            case "create":
                // Player creates room
                room.clients.set(msg.playerId, socket);

                socket.send(
                    JSON.stringify({
                        type: "created",
                        roomId: room.roomId
                    })
                );
                return;
            case "join":
		        // Player joins room
                room.clients.set(msg.playerId, socket);

                let role = "spectator";
                if (room.playerIds.includes(msg.playerId)) {
                    role = room.playerRoles.get(msg.playerId) ?? "spectator";
                }
                else if (!room.ruleSubmitted) {
                    role = "yarddog";
                    room.playerNames.set(msg.playerId, "Yarddog " + room.playerIds.length);
                    room.playerIds.push(msg.playerId);
                }

                room.playerRoles.set(msg.playerId, role);

                socket.send(
                    JSON.stringify({
                        type: "joined",
                        role,
                        playerNames: room.playerIds.map(id => room.playerNames.get(id)),
                        state: room.state,
                        ruleSubmitted: room.ruleSubmitted,
                        ruleCode: role === "yardmaster" ? room.ruleCode : null
                    })
                );

                update(msg.roomId);

                return;
            case "rule":
                // Player submits rules
                if (room.playerRoles.get(msg.playerId) !== "yardmaster") {
                    console.log("Rejected rule submission");
                    return;
                }

                room.ruleCode = msg.code;
                room.ruleSubmitted = true;

                const n = 7;

                room.deck = generateDeck(true);

                // Shuffle deck
                for (let i=room.deck.length-1; i>0; i--) {
                    const j = Math.floor(Math.random() * (i+1));
                    [room.deck[i], room.deck[j]] = [room.deck[j], room.deck[i]];
                }

                // Deal cards
                for (const playerId of room.playerIds) {
                    room.playerCards.set(playerId, room.deck.splice(0, n));
                }

                update(msg.roomId);

                return;
            case "yield":
                // Player yields rule
                const newYardmaster = room.playerNames.getKey(msg.playerName)

                if (room.playerRoles.get(msg.playerId) !== "yardmaster" || !newYardmaster) {
                    console.log(
                        "Rejected yield to",
                        msg.playerName,
                        "from",
                        msg.playerId
                    );

                    return;
                }
                
                room.playerRoles.set(msg.playerId, "yarddog");
                room.playerRoles.set(newYardmaster, "yardmaster");
                room.yardmaster = newYardmaster;
                
                socket.send(
                    JSON.stringify({
                        type: "joined",
                        role: "yarddog",
                        playerNames: room.playerIds.map(id => room.playerNames.get(id)),
                        state: room.state,
                        ruleSubmitted: room.ruleSubmitted,
                        ruleCode: null
                    })
                );
                
                room.clients.get(newYardmaster).send(
                    JSON.stringify({
                        type: "joined",
                        role: "yardmaster",
                        playerNames: room.playerIds.map(id => room.playerNames.get(id)),
                        state: room.state,
                        ruleSubmitted: room.ruleSubmitted,
                        ruleCode: null
                    })
                );

                update(room.roomId);

                return;
            case "spectate":
                // Player switches to spectator
                if (!room.playerIds.includes(msg.playerId)) {
                    console.log(
                        "Player does not exist",
                        msg.playerId
                    );
                    return;
                }

                room.playerRoles.set(msg.playerId, "spectator");

                socket.send(
                    JSON.stringify({
                        type: "joined",
                        role: "spectator",
                        playerNames: room.playerIds.map(id => room.playerNames.get(id)),
                        state: room.state,
                        ruleSubmitted: room.ruleSubmitted,
                        ruleCode: null
                    })
                );

                update(msg.roomId);

                return;
            case "yarddog":
                // Player switches to yarddog
                if (!room.playerIds.includes(msg.playerId)) {
                    console.log("Player does not exist");
                    return;
                }

                room.playerRoles.set(msg.playerId, "yarddog");

                socket.send(
                    JSON.stringify({
                        type: "joined",
                        role: "yarddog",
                        playerNames: room.playerIds.map(id => room.playerNames.get(id)),
                        state: room.state,
                        ruleSubmitted: room.ruleSubmitted,
                        ruleCode: null
                    })
                );

                update(msg.roomId);
                
                return;
            case "change":
                // Player changes name
                if (!Object.values(room.playerNames).includes(msg.playerName) && ~msg.playerName.startsWith("Yarddog")) {
                    room.playerNames.set(msg.playerId, msg.playerName);
                } else {
                    console.log("Rejected duplicate name");
                    return;
                }

                update(msg.roomId);

                return;
            case "play":
		        // Player plays a card
                const currentPlayer = room.playerIds[room.currentTurn];
                
                if (msg.playerId !== currentPlayer) {
                    console.log(
                        "Rejected play from",
                        msg.playerId
                    );

                    return;
                }

                const hand = room.playerCards.get(msg.playerId);

                if (!hand || !hand?.some(card => card.suit === msg.card.suit && card.rank === msg.card.rank)) {
                    console.log(
                        "Rejected invalid play from",
                        msg.playerId, hand
                    );

                    return;
                }

                room.playerCards.set(msg.playerId, hand.filter(card => JSON.stringify(card) !== JSON.stringify(msg.card)));

                room.clients.get(room.yardmaster).send(
                    JSON.stringify({
                        type:"evaluate",
                        card:msg.card
                    })
                );

                return;
            case "validate":
                // Yardmaster validates play
                room.state.push({
                    ...msg.card,
                    good: msg.good
                });

                // Player draws card if not good
                if (!msg.good) {
                    const currentPlayer = room.playerIds[room.currentTurn];
                    const hand = room.playerCards.get(currentPlayer);
                    const card = room.deck.pop();

                    if (hand && card) {
                        room.playerCards.set(currentPlayer, [
                            ...hand,
                            card
                        ]);
                    }
                }

                room.currentTurn = (room.currentTurn + 1) % room.playerIds.length;

                update(msg.roomId);

                return;
            }
	});

	socket.on("close", () => {
        console.log("client disconnected");

        if (socket.roomId && socket.playerId) {
            rooms.get(socket.roomId)?.clients.delete(socket.playerId);
        }
    });

});

function update(
	roomId: string
) {
    const room = rooms.get(roomId);

	if (!room) return;

    for (const playerId of room.playerIds) {
        room.clients.get(playerId).send(
            JSON.stringify({
                type: "updated",
                cards: room.playerCards.get(playerId),
                playerNames: room.playerIds.map(id => room.playerNames.get(id)),
                state: room.state,
                ruleSubmitted: room.ruleSubmitted
            })
        );
    }
}
