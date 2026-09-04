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
						size="small"
					/>
				{/if}

				<div class="player-info">
					<div class="player-name">{name}</div>
					<div class="player-details">
						{playerRoles[i]}, {playerCards[i]}
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
		padding: 2px;
		box-sizing: border-box;
	}

	.player {
		display: flex;
		align-items: center;
		gap: 8px;
		flex: 0 0 190px;
		width: 200px;
		min-width: 200px;
		box-sizing: border-box;
		padding: 8px 10px;
		background: rgba(245, 241, 230, 0.06);
		border: 2px solid rgba(255, 255, 255, 0.12);
		border-radius: 12px;
	}

	.player-info {
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex: 1 1 auto;
		min-width: 0;
		overflow: hidden;
	}

	.player-name {
		display: block;
		width: 100%;
		color: #f5f1e6;
		font-weight: 700;
		line-height: 1.2;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.player-details {
		display: block;
		width: 100%;
		color: #d8d2c0;
		font-size: 0.8rem;
		line-height: 1.2;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
