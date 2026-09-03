<script lang="ts">
	import PlayerBox from "./PlayerBox.svelte";

	let {
		playerNames,
		playerCharacters,
		playerRoles,
		playerCards
	} = $props();
</script>

<section class="players-row">
	{#each playerNames as name, i}
		<PlayerBox
			name={name}
			character={playerCharacters[i]}
			role={playerRoles[i]}
			cardCount={playerCards[i]}
		/>
	{/each}
</section>

<style>
	.players-row {
		display: flex;
		flex-direction: row;
		align-items: stretch;
		gap: 14px;
		width: 100%;
		overflow-x: auto;
		padding: 4px;
		box-sizing: border-box;
	}

	@media (max-width: 700px) {
		.players-row {
			gap: 8px;
		}
	}
</style>
