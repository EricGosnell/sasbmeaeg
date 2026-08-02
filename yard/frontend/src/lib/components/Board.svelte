<script lang="ts">
	import type { CardData } from '$lib/types/card';
	import Card from '$lib/components/Card.svelte';
	import '$lib/styles/board.css';

	let { cards }: { cards: CardData[] } = $props();
</script>

<div class="board">
	{#each cards as card}
		<Card {card} />
	{/each}
</div>