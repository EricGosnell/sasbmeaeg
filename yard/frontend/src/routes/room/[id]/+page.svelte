<script lang="ts">
	import { page } from "$app/state";
	import { onMount } from "svelte";
	import { connect, send } from "$lib/client/gameClient";
	import { evaluateRule } from "$lib/ruleClient";
	import { generateDeck, cardImage } from "../../../../../shared/src/utils/cards.ts";
	import type { CardData } from "../../../../../shared/src/types/card";

	let worker: Worker | null = null;

	let roomId = $state("");
  	let playerId = $state("");
  	let role = $state("");
	let playerName = $state("");
	let playerNames = $state<string[]>([]);
	let playerCharacters = $state<any[]>([]);
	let playerRoles = $state<string[]>([]);
	let playerCards = $state<number[]>([]);

	let cards = $state<CardData[]>([]);
    let state = $state<CardData[]>([]);

	let ruleSubmitted = $state(false);
	let ruleCode = $state("");

	let code = $state(`function rules(state) {
		return suit(last(state)) == "Spades";
	}`);

	function characterColor(character) {
		switch (character?.color) {
			case "Blue":
				return {
					head: "#168cff",
					body: "#0874d9"
				};
			case "Green":
				return {
					head: "#06d6a0",
					body: "#05b889"
				};
			case "Red":
				return {
					head: "#ef476f",
					body: "#d9365e"
				};
			case "Yellow":
				return {
					head: "#ffd166",
					body: "#e6b94f"
				};
			default:
				return {
					head: "#b000ff",
					body: "#a000e8"
				};
		}
	}

	onMount(() => {
		roomId = page.params.id;

		playerId = sessionStorage.getItem("playerId");
		playerName = sessionStorage.getItem("playerName");

		let playerCharacter = null;
		const storedCharacter = sessionStorage.getItem("playerCharacter");

		if (storedCharacter) {
			try {
				playerCharacter = JSON.parse(storedCharacter);
			} catch {
				playerCharacter = null;
			}
		}

		connect(
			async (msg) => {
				console.log("WebSocket message:", msg);

				switch (msg.type) {
					case "named":
						playerName = msg.playerName;
						sessionStorage.setItem("playerName", playerName);

						send({
							type: "join",
							roomId,
							playerId,
							playerName,
							character: playerCharacter
						});
						break;
					case "joined":
						role = msg.role;
						state = msg.state;
						playerNames = msg.playerNames;
						playerCharacters = msg.playerCharacters ?? [];
						playerRoles = msg.playerRoles;
						playerCards = msg.playerCards;

						ruleSubmitted = msg.ruleSubmitted;

						if (role === "yardmaster") {
							ruleCode = msg.ruleCode;
						}
						break;
					case "updated":
						cards = msg.cards;
						state = msg.state;
						playerNames = msg.playerNames;
						playerCharacters = msg.playerCharacters ?? [];
						playerRoles = msg.playerRoles;
						playerCards = msg.playerCards;
						ruleSubmitted = msg.ruleSubmitted;
						break;
					case "evaluate":
						if (role === "yardmaster") {
							const good = await evaluateRule(
								code,
								[...state, msg.card]
							);

							send({
								type: "validate",
								roomId,
								card: msg.card,
								good
							});
						}
						break;
					case "error":
						if (msg.message === "Room does not exist") {
							window.location.href = "/";
						}
						break;
				}
			},
			() => {
				if (!playerName?.trim()) {
					send({
						type: "name",
						roomId,
						playerId
					});
				} else {
					send({
						type: "join",
						roomId,
						playerId,
						playerName,
						character: playerCharacter
					});
				}
			}
		);
	});

	async function submitRule() {
		ruleSubmitted = true;
		ruleCode = code;

		send({
			type: "rule",
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
			type: "yield",
			roomId,
			playerId,
			playerName
		});
	}

	async function beSpectator(){
		send({
			type: "spectate",
			roomId,
			playerId
		});
	}

	async function beYarddog(){
		send({
			type: "yarddog",
			roomId,
			playerId
		});
	}

	async function play(card){
		send({
			type: "play",
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

{#each playerNames as name, i}
		<div class="player-row">
			{#if playerCharacters[i]}
				<svg
					viewBox="0 0 160 180"
					class="player-character"
					role="img"
					aria-label="{name}'s character"
				>
					<path
						d="M45 175
							C48 145 62 128 80 128
							C98 128 112 145 115 175
							Z"
						fill={characterColor(playerCharacters[i]).body}
						stroke="#090d18"
						stroke-width="7"
						stroke-linejoin="round"
					/>

					<circle
						cx="80"
						cy="75"
						r="52"
						fill={characterColor(playerCharacters[i]).head}
						stroke="#090d18"
						stroke-width="7"
					/>

					{#if playerCharacters[i].eyes === "Dot"}
						<circle cx="60" cy="68" r="7" fill="#090d18" />
						<circle cx="100" cy="68" r="7" fill="#090d18" />
					{:else if playerCharacters[i].eyes === "Sleepy"}
						<rect x="52" y="62" width="16" height="8" rx="4" fill="#090d18" />
						<rect x="92" y="62" width="16" height="8" rx="4" fill="#090d18" />
					{:else if playerCharacters[i].eyes === "Big"}
						<circle cx="60" cy="68" r="10" fill="#090d18" />
						<circle cx="100" cy="68" r="10" fill="#090d18" />
						<circle cx="63" cy="65" r="3" fill="white" />
						<circle cx="103" cy="65" r="3" fill="white" />
					{/if}

					{#if playerCharacters[i].mouth === "Smile"}
						<path
							d="M65 94 Q80 103 95 94"
							fill="none"
							stroke="#090d18"
							stroke-width="6"
							stroke-linecap="round"
						/>
					{:else if playerCharacters[i].mouth === "Flat"}
						<path
							d="M65 96 L95 96"
							fill="none"
							stroke="#090d18"
							stroke-width="6"
							stroke-linecap="round"
						/>
					{:else if playerCharacters[i].mouth === "Happy"}
						<path
							d="M65 94 Q80 108 95 94"
							fill="none"
							stroke="#090d18"
							stroke-width="6"
							stroke-linecap="round"
						/>
					{/if}
				</svg>
			{/if}

			<div>
				{name}: {playerRoles[i]}, {playerCards[i]}
			</div>
		</div>
{/each}

<br>

<div class="playing-row">
	{#each cards as card}
		<button
				disabled={!ruleSubmitted}
				onclick={() => play(card)}
		>
			<img
				class="played-card"
				src={cardImage(card.rank, card.suit)}
				alt="{card.rank} of {card.suit}"
			/>
		</button>
	{/each}
</div>

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
	.player-row {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 8px;
	}

	.player-character {
		width: 48px;
		height: 54px;
		flex-shrink: 0;
	}

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