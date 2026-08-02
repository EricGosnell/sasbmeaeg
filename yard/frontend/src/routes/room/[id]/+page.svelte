<script lang="ts">
	import { page } from "$app/state";
	import { onMount } from "svelte";
	import { connect, send } from "$lib/client/gameClient";
	import { evaluateRule } from "$lib/ruleClient";

	let worker: Worker | null = null;

	let roomId = $state("");
    let player = $state("");
    let role = $state("");

    let state = $state<any[]>([]);

	let ruleSubmitted = $state(false);
	let ruleCode = $state("");

	let code = $state(`function rules(state) {
		return suit(last(state)) == "Spades";
	}`);

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

					ruleSubmitted = msg.ruleSubmitted;
					if (role === "yardmaster") {
						ruleCode = msg.ruleCode;
					}
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

	async function play(card){
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

<button
	disabled={role === "yardmaster" && !ruleSubmitted}
	onclick={() => play({
		rank:"A",
		suit:"Spades"
	})}
>
	Up (Ace of Spades)
</button>

<button
	disabled={role === "yardmaster" && !ruleSubmitted}
	onclick={() => play({
		rank:"2",
		suit:"Diamonds"
	})}
>
	Down (2 of Diamonds)
</button>

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
