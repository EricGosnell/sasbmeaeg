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
		play
	}: {
		playerName: string;
		playerCharacter: any;
		cards: CardData[];
		role: string;
		ruleSubmitted: boolean;
		play: (card: CardData) => void;
	} = $props();
</script>

<div class="player-area">
	<div class="character-section">
		<Character
			character={playerCharacter}
			size="normal"
			ariaLabel="Your character"
		/>

		<div class="player-name">
			{playerName}
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
		color: #f5f1e6;
		font-weight: 700;
		text-align: center;
		margin-top: 4px;
		white-space: nowrap;
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
		cursor: pointer;
		transition: transform 0.15s ease;
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
			width: 70px;
			height: 120px;
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
