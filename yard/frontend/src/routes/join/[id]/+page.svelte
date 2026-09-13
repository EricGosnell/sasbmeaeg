<script lang="ts">
	import { onMount } from "svelte";

	let { data } = $props();

	onMount(() => {
		sessionStorage.setItem("joinRoomId", data.id);
		window.location.href = "/";
	});
</script>