import { WebSocket, WebSocketServer } from "ws";
import type { CardData } from "@sasbmeaeg/shared";
import { generateDeck } from "@sasbmeaeg/shared";

const wss = new WebSocketServer({port: 8080});

declare module "ws" {
    interface WebSocket {
        roomId?: string;
        playerId?: string;
    }
}

type CharacterData = {
    color: string;
    eyes: string;
    mouth: string;
};

const defaultCharacter: CharacterData = {
    color: "Purple",
    eyes: "Dot",
    mouth: "Smile"
};

function normalizeCharacter(character: any): CharacterData {
    if (!character) {
        return {...defaultCharacter};
    }

    const validColors = ["Purple", "Blue", "Green", "Red", "Yellow"];
    const validEyes = ["Dot", "Sleepy", "Big"];
    const validMouths = ["Smile", "Flat", "Happy"];

    return {
        color: validColors.includes(character.color)
            ? character.color
            : defaultCharacter.color,
        eyes: validEyes.includes(character.eyes)
            ? character.eyes
            : defaultCharacter.eyes,
        mouth: validMouths.includes(character.mouth)
            ? character.mouth
            : defaultCharacter.mouth
    };
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
	playerIds: Set<string>;
    playerNames: BiMap<string, string>;
    playerCharacters: Map<string, CharacterData>;
    playerRoles: Map<string, string>;
    playerCards: Map<string, CardData[]>;
    playerOrder: string[];
    deck: CardData[];
	yardmaster: string;
	currentTurn: number;
	state: any[];
	ruleCode: string | null;
	ruleSubmitted: boolean;
};

const rooms = new Map<string, Room>();

function createRoom(playerId:string, character?: CharacterData) {
    let id: string;
    do {
        id = Math.random().toString(36).substring(2, 8);
    } while (rooms.has(id));

	const room: Room = {
        roomId: id,
		clients: new Map(),
		playerIds: new Set([playerId]),
        playerNames: (() => {
            const p = new BiMap<string, string>();
            p.set(playerId, "Yardmaster");
            return p;
        })(),
        playerCharacters: new Map([
            [playerId, normalizeCharacter(character)]
        ]),
        playerRoles: new Map([
            [playerId, "yardmaster"]
        ]),
        playerCards: new Map(),
        playerOrder: [],
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
            ? createRoom(msg.playerId, msg.character)
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
                room.playerCharacters.set(
                    msg.playerId,
                    normalizeCharacter(msg.character)
                );

                socket.send(
                    JSON.stringify({
                        type: "created",
                        roomId: room.roomId
                    })
                );
                return;
            case "check":
                if (room.playerNames.getKey(msg.playerName) !== undefined) {
                    socket.send(
                        JSON.stringify({
                            type: "error",
                            message: "Player name already taken"
                        })
                    );
                    return;
                }

                socket.send(
                    JSON.stringify({
                        type: "exists"
                    })
                );
                return;
            case "name":
                socket.send(
                    JSON.stringify({
                        type: "named",
                        playerName: Math.random().toString(36).substring(2, 8)
                    })
                );
                return;
            case "join":
		        // Player joins room
                room.clients.set(msg.playerId, socket);

                let role = "spectator";
                if (room.playerIds.has(msg.playerId)) {
                    role = room.playerRoles.get(msg.playerId) ?? "spectator";
                }
                else if (!room.ruleSubmitted) {
                    role = "yarddog";
                    room.playerIds.add(msg.playerId);
                }

                room.playerNames.set(msg.playerId, msg.playerName);
                room.playerCharacters.set(
                    msg.playerId,
                    normalizeCharacter(msg.character)
                );
                room.playerRoles.set(msg.playerId, role);

                socket.send(
                    JSON.stringify({
                        type: "joined",
                        role,
                        playerNames: [...room.playerIds].map(id => room.playerNames.get(id)),
                        playerCharacters: [...room.playerIds].map(id => room.playerCharacters.get(id)),
                        playerRoles: [...room.playerIds].map(id => room.playerRoles.get(id)),
                        playerCards: [...room.playerIds].map(id => room.playerCards.get(id)?.length),
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

                room.playerOrder = [room.yardmaster];
                for (const playerId of room.playerIds) {
                    if (room.playerRoles.get(playerId) === "yarddog") {
                        room.playerOrder.push(playerId);
                    }
                }

                const n = 7;

                room.deck = generateDeck(true);

                // Shuffle deck
                for (let i=room.deck.length-1; i>0; i--) {
                    const j = Math.floor(Math.random() * (i+1));
                    [room.deck[i], room.deck[j]] = [room.deck[j], room.deck[i]];
                }

                // Deal cards
                for (const playerId of room.playerOrder) {
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
                        playerNames: [...room.playerIds].map(id => room.playerNames.get(id)),
                        playerCharacters: [...room.playerIds].map(id => room.playerCharacters.get(id)),
                        playerRoles: [...room.playerIds].map(id => room.playerRoles.get(id)),
                        state: room.state,
                        ruleSubmitted: room.ruleSubmitted,
                        ruleCode: null
                    })
                );
                
                room.clients.get(newYardmaster).send(
                    JSON.stringify({
                        type: "joined",
                        role: "yardmaster",
                        playerNames: [...room.playerIds].map(id => room.playerNames.get(id)),
                        playerCharacters: [...room.playerIds].map(id => room.playerCharacters.get(id)),
                        playerRoles: [...room.playerIds].map(id => room.playerRoles.get(id)),
                        state: room.state,
                        ruleSubmitted: room.ruleSubmitted,
                        ruleCode: null
                    })
                );

                update(room.roomId);

                return;
            case "spectate":
                // Player switches to spectator
                if (!room.playerIds.has(msg.playerId)) {
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
                        playerNames: [...room.playerIds].map(id => room.playerNames.get(id)),
                        playerCharacters: [...room.playerIds].map(id => room.playerCharacters.get(id)),
                        playerRoles: [...room.playerIds].map(id => room.playerRoles.get(id)),
                        state: room.state,
                        ruleSubmitted: room.ruleSubmitted,
                        ruleCode: null
                    })
                );

                update(msg.roomId);

                return;
            case "yarddog":
                // Player switches to yarddog
                if (!room.playerIds.has(msg.playerId)) {
                    console.log("Player does not exist");
                    return;
                }

                room.playerRoles.set(msg.playerId, "yarddog");

                socket.send(
                    JSON.stringify({
                        type: "joined",
                        role: "yarddog",
                        playerNames: [...room.playerIds].map(id => room.playerNames.get(id)),
                        playerCharacters: [...room.playerIds].map(id => room.playerCharacters.get(id)),
                        playerRoles: [...room.playerIds].map(id => room.playerRoles.get(id)),
                        state: room.state,
                        ruleSubmitted: room.ruleSubmitted,
                        ruleCode: null
                    })
                );

                update(msg.roomId);
                
                return;
            case "play":
		        // Player plays a card
                const currentPlayer = room.playerOrder[room.currentTurn];
                
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
                    const currentPlayer = room.playerOrder[room.currentTurn];
                    const hand = room.playerCards.get(currentPlayer);
                    const card = room.deck.pop();

                    if (hand && card) {
                        room.playerCards.set(currentPlayer, [
                            ...hand,
                            card
                        ]);
                    }
                }
                else {
                    const currentPlayer = room.playerOrder[room.currentTurn];
                    const hand = room.playerCards.get(currentPlayer);
                    
                    if (hand && !hand.length) {
                        room.clients.get(currentPlayer).send(
                            JSON.stringify({
                                type: "depleted"
                            })
                        );
                    }
                }

                room.currentTurn = (room.currentTurn + 1) % room.playerOrder.length;

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

    for (const [playerId, client] of room.clients) {
        if (client.readyState !== WebSocket.OPEN) continue;

        const message: any = {
            type: "updated",
            playerNames: [...room.playerIds].map(id => room.playerNames.get(id)),
            playerCharacters: [...room.playerIds].map(id => room.playerCharacters.get(id)),
            playerRoles: [...room.playerIds].map(id => room.playerRoles.get(id)),
            playerCards: [...room.playerIds].map(id => room.playerCards.get(id)?.length),
            state: room.state,
            ruleSubmitted: room.ruleSubmitted
        };

        if (room.playerIds.has(playerId)) {
            message.cards = room.playerCards.get(playerId);
        }

        client.send(JSON.stringify(message));
    }
}