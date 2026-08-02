<script lang="ts">
	import { page } from "$app/state";
	import { onMount } from "svelte";
	import { connect, send } from "$lib/client/gameClient";
	import { evaluateRule } from "$lib/ruleClient";
	import { generateDeck } from "$lib/utils/cards";
	import type { CardData } from "$lib/types/card";

	let worker: Worker | null = null;
	let ruleCode = $state("");

	let roomId = $state("");
	let player = $state("");

	let state = $state<any[]>([]);
	let role = $state("");
	let result = $state("");

	let code = $state(`function rules(state) {
       return suit(last(state)) == "Spades";
    }`);

	let ruleSubmitted = $state(false);

	let pendingPlay = $state<any>(null);
	let lastValidated = $state<string | null>(null);

	const deck: CardData[] = generateDeck(true);

	onMount(() => {
		roomId = page.params.id;

		player =
				new URLSearchParams(
						window.location.search
				).get("player") ?? "";

		connect(
				roomId,
				player,
				async (msg) => {

					console.log(
							"WebSocket message:",
							msg
					);

					if (msg.type === "joined") {

						role = msg.role;

						state = msg.state;

						pendingPlay = msg.pendingPlay;

						ruleSubmitted = msg.ruleSubmitted;

						if (role === "yardmaster") {
							ruleCode = msg.ruleCode;
						}

						console.log(
								"Joined as:",
								role
						);

					}


					if(msg.type === "pending_play") {

						if(role === "yardmaster") {


							const nextState = [
								...state,
								msg.card
							];


							const plainState =
									JSON.parse(
											JSON.stringify(nextState)
									);


							const good =
									await evaluateRule(
											code,
											plainState
									);


							send({
								type:"validate",
								roomId,
								playerId:player,
								good
							});


						}

					}

					if (msg.type === "result") {

						state = [
							...state,
							{
								...msg.card,
								good: msg.good
							}
						];

						result =
								msg.good
										? "Good"
										: "Bad";

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
			playerId:player,
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

	function evaluate(card): Promise<boolean> {

		return new Promise((resolve) => {

			if (!worker) {
				resolve(false);
				return;
			}


			worker.onmessage = (event) => {

				if(event.data.ok){
					resolve(
							event.data.result
					);
				}
				else {
					console.error(
							event.data.error
					);

					resolve(false);
				}
			};

			const cleanState = $state.snapshot([
				...state,
				card
			]);

			worker.postMessage({
				code: ruleCode,
				state: cleanState
			});

		});
	}

	async function play(card){

		if (role === "yardmaster" && !ruleSubmitted) {
			result = "Submit rules first";
			return;
		}

		let good = null;


		if (role === "yardmaster") {
			good = await evaluate(card);
		}


		send({
			type:"play",
			roomId,
			playerId:player,
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
			disabled={role === "yardmaster" && ruleSubmitted}
	></textarea>

	<br>

	{#if !ruleSubmitted}

		<button onclick={submitRule}>
			{ruleSubmitted ? "Rule Submitted" : "Submit Rule"}
		</button>

	{/if}

{/if}

{#if role !== "spectator"}

	{#each deck as card}

		<button
				disabled={role === "yardmaster" && !ruleSubmitted}
				onclick={() => play(card)}
		>
			{card.rank} of {card.suit}
		</button>

	{/each}

{/if}

<ul>
	{#each state as card}
		<li>
			{card.rank} of {card.suit}:
		
			{#if card.good}
				Good
			{:else}
				Bad
			{/if}
		</li>
	{/each}
</ul>
