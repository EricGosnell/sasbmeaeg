<script lang="ts">
	import Character from "./Character.svelte";

	let {
		name,
		character,
		role,
		cardCount
	} = $props();
</script>

<div class="player-box">
	{#if character}
		<Character
			{character}
			size="small"
		/>
	{/if}

	<div class="player-name">
		{name}
	</div>

	<div class="player-role">
		{role}
	</div>

	<div class="card-count">
		{cardCount} cards
	</div>
</div>

<style>
	.player-box {
		flex: 0 0 150px;
		min-height: 150px;
		padding: 12px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: rgba(245, 241, 230, 0.06);
		border: 2px solid rgba(255, 255, 255, 0.12);
		border-radius: 14px;
	}

	.player-name {
		margin-top: 4px;
		font-weight: 700;
		color: #f5f1e6;
		text-align: center;
	}

	.player-role {
		margin-top: 2px;
		font-size: 0.85rem;
		color: #d8d2c0;
		text-transform: capitalize;
	}

	.card-count {
		margin-top: 4px;
		font-size: 0.8rem;
		color: #aaa493;
	}

	@media (max-width: 700px) {
		.player-box {
			flex-basis: 120px;
			min-height: 130px;
			padding: 8px;
		}
	}
</style>
