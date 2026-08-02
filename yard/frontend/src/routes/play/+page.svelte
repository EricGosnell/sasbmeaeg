<script lang="ts">
	import Board from '$lib/components/Board.svelte';
	import { generateDeck, cardBack } from '../../../../shared/src/utils/cards.ts';
	import '$lib/styles/card.css';

	const cards = generateDeck();
</script>

<Board {cards} />
<div class="card-back-wrapper">
	<img class="card" src={cardBack} alt="Card back" />
</div>