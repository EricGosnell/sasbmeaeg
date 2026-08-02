import type {
	ClientMessage,
	ServerMessage
} from "$lib/types/messages";


let socket: WebSocket | null = null;


export function connect(
	roomId:string | null,
	playerId:string,
	onMessage:(msg:ServerMessage)=>void,
	onOpen?:()=>void
){

	socket = new WebSocket(
		"ws://localhost:8080"
	);


	socket.onopen = ()=>{

		console.log(
			"websocket connected"
		);


		if(roomId){

			send({
				type:"join",
				roomId,
				playerId
			});

		}


		onOpen?.();

	};


	socket.onmessage=(event)=>{

		const msg =
			JSON.parse(
				event.data
			);

		console.log(
			"CLIENT RECEIVED:",
			msg
		);

		onMessage(msg);

	};

}

export function send(
	message:ClientMessage
){

	socket?.send(
		JSON.stringify(message)
	);

}