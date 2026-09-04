<script lang="ts">
	import Character from "./Character.svelte";

	let {
		playerName,
		playerIds,
		playerNames,
		playerCharacters,
		playerRoles,
		playerCards,
		currentTurnPlayerId
	}: {
		playerName: string;
		playerIds: string[];
		playerNames: string[];
		playerCharacters: any[];
		playerRoles: string[];
		playerCards: number[];
		currentTurnPlayerId: string;
	} = $props();
</script>

<div class="players-row">
	{#each playerNames as name, i}
		{#if name !== playerName}
			<div
				class="player"
				class:current-turn={playerIds[i] === currentTurnPlayerId}
			>
				{#if playerCharacters[i]}
					<Character
						character={playerCharacters[i]}
						size="small"
					/>
				{/if}

				<div class="player-info">
					<div class="player-name">{name}</div>
					<div class="player-details">
                        <div class="player-role">
                            {playerRoles[i] === "yardmaster"
                                ? "Yardmaster"
                                : playerRoles[i] === "yarddog"
                                    ? "Yard Dog"
                                    : "Spectator"}
                        </div>

                        <div class="card-backs">
                            {#each Array(playerCards[i] ?? 0) as _}
                                <div class="card-back"></div>
                            {/each}
                        </div>
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
		justify-content: center;
		gap: 8px;
		flex: 0 0 auto;
		width: 180px;
		box-sizing: border-box;
		padding: 8px 12px;
		background: rgba(245, 241, 230, 0.06);
		border: 2px solid rgba(255, 255, 255, 0.12);
		border-radius: 12px;
	}

	.player.current-turn {
		border-color: #ffd166;
		background: rgba(255, 209, 102, 0.16);
		box-shadow:
			0 0 0 2px rgba(255, 209, 102, 0.25),
			0 0 14px rgba(255, 209, 102, 0.35);
	}

	.player-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		min-width: 0;
		width: 110px;
	}

	.player-name {
		width: 110px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

    .player-details {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        color: #d8d2c0;
        font-size: 0.8rem;
    }

    .player-role {
        font-weight: 600;
        white-space: nowrap;
    }

    .card-backs {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        height: 27px;
    }

    .card-back {
        width: 17px;
        height: 25px;
        background: #c2bec4ff;
        border: 2px solid #090d18;
        border-radius: 4px;
        box-sizing: border-box;
        margin-left: -10px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
    }

    .card-back:first-child {
        margin-left: 0;
    }

</style>
