<script lang="ts">
import { connect, send } from "$lib/client/gameClient.js";

let playerName = $state("");
let roomId = $state("");

async function createRoom(){
	const playerId = crypto.randomUUID();

	sessionStorage.setItem("playerId", playerId);
	sessionStorage.setItem("playerName", playerName);

	connect(
		(msg)=>{
			if (msg.type === "created") {
				window.location.href =
					"/room/" +
					msg.roomId;
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

function joinRoom() {
	if (!roomId.trim()) {
		alert("Please enter a room ID");
		return;
	}

	const playerId = crypto.randomUUID();

	sessionStorage.setItem("playerId", playerId);
	sessionStorage.setItem("playerName", playerName);

	connect(
		(msg) => {
			if (msg.type === "error") {
				alert(msg.message);
				return;
			}

			if (msg.type === "exists") {
				window.location.href = "/room/" + roomId;
			}
		},
		() => {
			send({
				type: "check",
				roomId,
				playerName
			});
		}
	);
}

</script>


<h1>SASBMEAEG</h1>

Player Name: 
<input
	bind:value={playerName}
	placeholder="Random Name"
/>

<br>

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