<script lang="ts">
	import { page } from "$app/state";
	import { onMount } from "svelte";

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

	onMount(() => {
		roomId = page.params.id;

		player =
			new URLSearchParams(
				window.location.search
			).get("player") ?? "";

		refresh();

		setInterval(refresh, 100);
	});

	async function submitRule() {

		ruleSubmitted = true;

		ruleCode = code;


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


		await fetch(
			`/api/rule/${roomId}`,
			{
				method:"POST",
				body:JSON.stringify({
					player,
					code
				})
			}
		);
	}

	async function autoValidate() {

		if (role !== "yardmaster")
			return;

		if (!pendingPlay)
			return;

		const id =
			JSON.stringify(pendingPlay);


		// prevents validating the same play repeatedly
		if (id === lastValidated)
			return;


		lastValidated = id;


		const good =
			await evaluate(
				pendingPlay.card
			);


		await fetch(
			`/api/validate/${roomId}`,
			{
				method:"POST",
				body:JSON.stringify({
					player,
					good
				})
			}
		);


		await refresh();
	}

	async function validatePending(){

		if (!pendingPlay)
			return;


		const good =
			await evaluate(
				pendingPlay.card
			);


		await fetch(
			`/api/validate/${roomId}`,
			{
				method:"POST",
				body:JSON.stringify({
					player,
					good
				})
			}
		);

		await refresh();
	}

	async function refresh() {
		if (!roomId) return;

		const res =
            await fetch(
                `/api/room/${roomId}?player=${player}`
            );

		const data =
			await res.json();

		state = data.state;
		role = data.role;
		pendingPlay = data.pendingPlay;
		
		await autoValidate();
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


		await fetch(
			`/api/play/${roomId}`,
			{
				method:"POST",
				body:JSON.stringify({
					player,
					card,
					good
				})
			}
		);

		await refresh();
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
	disabled={role === "yardmaster" && !ruleSubmitted}
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

{#each state as card}
	<p>
		{card.rank} of {card.suit}:
		
		{#if card.good}
			Good
		{:else}
			Bad
		{/if}
	</p>
{/each}