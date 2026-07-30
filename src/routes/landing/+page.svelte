<script lang="ts">

async function createRoom(){

	const res =
		await fetch("/api/create", {
			method:"POST"
		});

	const data =
		await res.json();


	window.location.href =
		"/room/" + data.roomId
		+ "?player="
		+ data.playerId;

}


let roomId = $state("");

async function joinRoom(){

	const res =
		await fetch("/api/join", {
			method:"POST",
			body: JSON.stringify({
				roomId
			})
		});

	const data =
		await res.json();


	window.location.href =
		"/room/" + roomId
		+ "?player="
		+ data.playerId;

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