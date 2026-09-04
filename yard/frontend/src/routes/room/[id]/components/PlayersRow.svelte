<script lang="ts">
	import Character from "./Character.svelte";

	let {
		playerName,
		playerNames,
		playerCharacters,
		playerRoles,
		playerCards
	}: {
		playerName: string;
		playerNames: string[];
		playerCharacters: any[];
		playerRoles: string[];
		playerCards: number[];
	} = $props();
</script>

<div class="players-row">
	{#each playerNames as name, i}
		{#if name !== playerName}
			<div class="player">
				{#if playerCharacters[i]}
					<Character
						character={playerCharacters[i]}
						size={48}
					/>
				{/if}

				<div class="player-info">
					<div class="player-name">{name}</div>

					<div class="player-details">
						{playerRoles[i]}, {playerCards[i] ?? 0}
					</div>
				</div>
			</div>
		{/if}
	{/each}
</div>

<style>
	.players-row {
		display: flex;
		flex-direction: row;
		gap: 12px;
		width: 100%;
		overflow-x: auto;
	}

	.player {
		display: flex;
		align-items: center;
		gap: 8px;
		flex: 0 0 auto;
		padding: 8px 12px;
		background: rgba(245, 241, 230, 0.06);
		border: 2px solid rgba(255, 255, 255, 0.12);
		border-radius: 12px;
	}

	.player-name {
		font-weight: 700;
	}

	.player-details {
		color: #d8d2c0;
		font-size: 0.8rem;
	}
</style>
