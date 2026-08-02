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
		import.meta.env.DEV
			? "ws://localhost:8080"
			: `wss://${location.host}/ws`
	);

	socket.onopen = ()=>{
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
		onMessage(JSON.parse(event.data));
	};
}

export function send(
	message:ClientMessage
){
	socket?.send(JSON.stringify(message));
}