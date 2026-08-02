<script lang="ts">
import { connect, send } from "$lib/client/gameClient";

let roomId = $state("");

async function createRoom(){
	const playerId = crypto.randomUUID();

	connect(
		null,
		playerId,
		(msg)=>{
			if(msg.type==="created"){
				window.location.href =
					"/room/" +
					msg.roomId +
					"?player=" +
					playerId;
			}
		},
		()=>{
			send({
				type:"create",
				playerId
			});
		}
	);
}

function joinRoom(){
	const playerId = crypto.randomUUID();

	window.location.href =
		"/room/" +
		roomId +
		"?player=" +
		playerId;
}

</script>


<h1>SASBMEAEG</h1>


<button onclick={createRoom}>
	Create Room
</button>


<br>


<input
	bind:value={roomId}
	placeholder="Room ID"
/>


<button onclick={joinRoom}>
	Join Room
</button>