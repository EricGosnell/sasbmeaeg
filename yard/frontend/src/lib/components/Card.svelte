<script lang="ts">
	import type { CardData } from '../../../../shared';
	import { cardImage } from '../../../../shared/src/utils/cards.ts';
	import '$lib/styles/card.css';

	let { card }: { card: CardData } = $props();
</script>

<img class="card" src={cardImage(card.rank, card.suit)} alt="{card.rank} of {card.suit}" />