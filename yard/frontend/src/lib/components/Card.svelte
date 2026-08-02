<script lang="ts">
	import type { CardData } from '$lib/types/card';
	import { cardImage } from '$lib/utils/cards';
	import '$lib/styles/card.css';

	let { card }: { card: CardData } = $props();
</script>

<img class="card" src={cardImage(card.rank, card.suit)} alt="{card.rank} of {card.suit}" />