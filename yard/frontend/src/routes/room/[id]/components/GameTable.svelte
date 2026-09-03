<script lang="ts">
	import { cardImage } from "../../../../../../shared/src/utils/cards.ts";
	import type { CardData } from "../../../../../../shared/src/types/card";

	let {
		state
	}: {
		state: CardData[];
	} = $props();
</script>

<div class="table">
	<div class="table-scroll">
		<div class="played-row">
			{#each state as card}
				<img
					class="played-card"
					class:bad-offset={!card.good}
					src={cardImage(card.rank, card.suit)}
					alt="{card.rank} of {card.suit}"
				/>
			{/each}
		</div>
	</div>
</div>

<style>
	.table {
		width: 100%;
		height: 100%;
		min-height: 280px;
		box-sizing: border-box;
		background: rgba(0, 0, 0, 0.15);
		border: 2px solid rgba(255, 255, 255, 0.12);
		border-radius: 16px;
		overflow: hidden;
	}

	.table-scroll {
		width: 100%;
		height: 100%;
		overflow-x: auto;
		overflow-y: hidden;
	}

	.played-row {
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		gap: 2px;
		min-width: max-content;
		min-height: 100%;
		padding: 30px;
		box-sizing: border-box;
	}

	.played-card {
		width: 80px;
		height: auto;
		flex-shrink: 0;
	}

	.played-card.bad-offset {
		transform: translateY(-18px);
	}

	@media (max-width: 700px) {
		.table {
			min-height: 220px;
		}

		.played-row {
			padding: 20px;
		}

		.played-card {
			width: 65px;
		}
	}
</style>
