<script lang="ts">
	import { page } from "$app/state";
	import { onMount } from "svelte";
	import { connect, send } from "$lib/client/gameClient";
	import { evaluateRule } from "$lib/ruleClient";
	import { generateDeck, cardImage } from "$lib/utils/cards";
	import type { CardData } from "$lib/types/card";

	let worker: Worker | null = null;

	let roomId = $state("");
  let playerId = $state("");
  let role = $state("");
	let playerName = $state("");
	let playerNames = $state<string[]>([]);

  let state = $state<CardData[]>([]);

	let ruleSubmitted = $state(false);
	let ruleCode = $state("");

	let code = $state(`function rules(state) {
		return suit(last(state)) == "Spades";
	}`);

	const deck: CardData[] = generateDeck(true);

	onMount(() => {
		roomId = page.params.id;

		playerId =
			new URLSearchParams(
				window.location.search
			).get("player") ?? "";

		connect(
			roomId,
			playerId,
			async (msg) => {
				console.log(
					"WebSocket message:",
					msg
				);

				if (msg.type === "joined") {
					role = msg.role;
					state = msg.state;
					playerNames = msg.playerNames;

					ruleSubmitted = msg.ruleSubmitted;
					if (role === "yardmaster") {
						ruleCode = msg.ruleCode;
					}
				}

				if (msg.type === "updated") {
					state = msg.state;
					playerNames = msg.playerNames;
					ruleSubmitted = msg.ruleSubmitted;
				}

				if(msg.type === "evaluate") {
					if(role === "yardmaster") {
						const good =
							await evaluateRule(
								code,
								[...state, msg.card]
							);

						send({
							type:"validate",
							roomId,
							card:msg.card,
							good
						});
					}
				}

				if (msg.type === "validated") {
					state = [
						...state,
						{
							...msg.card,
							good: msg.good
						}
					];
				}
			}
		);
	});

	async function submitRule() {
		ruleSubmitted = true;
		ruleCode = code;

		send({
			type:"rule",
			roomId,
			playerId,
			code
		});

		worker?.terminate();
		worker = new Worker(
				new URL(
						"../../../lib/ruleWorker.ts",
						import.meta.url
				),
				{
					type:"module"
				}
		);
	}

	async function yieldRule(){
		send({
			type:"yield",
			roomId,
			playerId,
			playerName
		});
	}

	async function beSpectator(){
		send({
			type:"spectate",
			roomId,
			playerId
		});
	}

	async function beYarddog(){
		send({
			type:"yarddog",
			roomId,
			playerId
		});
	}

	async function changeName(){
		send({
			type:"change",
			roomId,
			playerId,
			playerName
		});
	}

	async function play(card){
		send({
			type:"play",
			roomId,
			playerId,
			card
		});
	}

</script>


<h1>
	Room {roomId}
</h1>

<p>
	Role: {role}
</p>

{#if role === "yardmaster"}

	<h2>Your Secret Rule</h2>

<textarea
	bind:value={code}
	rows="10"
	cols="60"
	disabled={ruleSubmitted}
></textarea>

	<br>

{/if}

{#if !ruleSubmitted}

{#if role === "yardmaster"}

<button onclick={submitRule}>
	{ruleSubmitted ? "Rule Submitted" : "Submit Rule"}
</button>

<input
	bind:value={playerName}
	placeholder="New Yardmaster"
/>

<button onclick={yieldRule}>
	Yield Rule
</button>

{/if}

{#if role === "yarddog"}

<button onclick={beSpectator}>
	Be Spectator
</button>

{/if}

{#if role === "spectator"}

<button onclick={beYarddog}>
	Be Yarddog
</button>

{/if}

{/if}

{#if role !== "spectator"}

	{#each deck as card}

		<button
				disabled={!ruleSubmitted}
				onclick={() => play(card)}
		>
			{card.rank} of {card.suit}
		</button>

	{/each}

<input
	bind:value={playerName}
	placeholder="Player Name"
/>

<button onclick={changeName}>
	Change Name
</button>

{#each playerNames as name}
		<br>
		{name}
{/each}

{/if}

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

<style>
	.played-row {
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		gap: 2px;
		padding: 20px;
	}

	.played-card {
		width: 80px;
	}

	.played-card.bad-offset {
		transform: translateY(-18px);
	}
</style>