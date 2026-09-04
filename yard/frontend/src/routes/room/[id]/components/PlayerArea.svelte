<script lang="ts">
	import { cardImage } from "../../../../../../shared/src/utils/cards.ts";
	import type { CardData } from "../../../../../../shared/src/types/card";
	import Character from "./Character.svelte";

	let {
		playerName,
		playerCharacter,
		cards,
		role,
		ruleSubmitted,
		play,
		playerId,
		currentTurnPlayerId
	}: {
		playerName: string;
		playerCharacter: any;
		cards: CardData[];
		role: string;
		ruleSubmitted: boolean;
		play: (card: CardData) => void;
		playerId: string;
		currentTurnPlayerId: string;
	} = $props();

	const displayRole = $derived(
        role === "yardmaster"
            ? "Yardmaster"
            : role === "yarddog"
                ? "Yard Dog"
                : "Spectator"
    );

    const isMyTurn = $derived(playerId === currentTurnPlayerId);

</script>

<div class:my-turn={isMyTurn} class="player-area">
	<div class="character-section">
		{#if playerCharacter}
			<Character character={playerCharacter} />
		{/if}

		<div class="player-name">
			{playerName}
		</div>

		<div class="player-role">
			{displayRole}
		</div>
	</div>

	<div class="hand-section">
		{#each cards as card}
			<button
				class="hand-card"
				disabled={!ruleSubmitted}
				onclick={() => play(card)}
			>
				<img
					src={cardImage(card.rank, card.suit)}
					alt="{card.rank} of {card.suit}"
				/>
			</button>
		{/each}
	</div>
</div>

<style>
	.player-area {
		display: flex;
		align-items: flex-end;
		gap: 20px;
		width: 100%;
		height: 100%;
		min-height: 180px;
		box-sizing: border-box;
		padding: 20px;
		background: rgba(245, 241, 230, 0.06);
		border: 2px solid rgba(255, 255, 255, 0.12);
		border-radius: 16px;
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease;
	}

	.player-area.my-turn {
		border-color: #ffd166;
		box-shadow:
			0 0 8px rgba(255, 209, 102, 0.7),
			0 0 20px rgba(255, 209, 102, 0.35);
	}

	.character-section {
        flex: 0 0 100px;
        min-width: 0;
        width: 100px;
        height: 160px;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        overflow: hidden;
    }

	.player-name {
        width: 100%;
        max-width: 100px;
        min-width: 0;
        box-sizing: border-box;

        color: #f5f1e6;
        font-weight: 700;
        text-align: center;
        margin-top: 4px;

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

	.player-role {
        width: 100%;
        min-width: 0;
        box-sizing: border-box;

        color: #d8d2c0;
        font-size: 0.8rem;
        text-align: center;
        margin-top: 2px;

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

	.hand-section {
		display: flex;
		align-items: flex-end;
		justify-content: center;
		gap: 4px;
		flex: 1;
		min-width: 0;
		height: 160px;
		overflow-x: auto;
	}

	.hand-card {
		flex: 0 0 auto;
		width: 80px;
		padding: 0;
		background: none;
		border: none;
		border-radius: 8px;
		box-shadow: none;
	}

	.hand-card:hover {
		transform: translateY(-8px);
	}

	.hand-card:disabled {
		cursor: default;
		opacity: 0.7;
	}

	.hand-card:disabled:hover {
		transform: none;
	}

	.hand-card img {
		display: block;
		width: 80px;
		height: auto;
	}

	@media (max-width: 700px) {
		.player-area {
			min-height: 150px;
			padding: 12px;
		}

		.character-section {
            flex-shrink: 0;
            width: 100px;
            height: 160px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-end;
        }

        .player-name {
            width: 100%;
            min-width: 0;
            box-sizing: border-box;

            color: #f5f1e6;
            font-weight: 700;
            text-align: center;
            margin-top: 4px;

            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .player-role {
            width: 100%;
            min-width: 0;
            box-sizing: border-box;

            color: #d8d2c0;
            font-size: 0.8rem;
            text-align: center;
            margin-top: 2px;

            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

		.hand-section {
			height: 135px;
		}

		.hand-card,
		.hand-card img {
			width: 65px;
		}
	}
</style>