<script lang="ts">
	import { page } from "$app/state";
	import { onMount } from "svelte";
	import { connect, send } from "$lib/client/gameClient";
	import { evaluateRule } from "$lib/ruleClient";
	import type { CardData } from "../../../../../shared/src/types/card";

	import GameHeader from "./components/GameHeader.svelte";
	import PlayersRow from "./components/PlayersRow.svelte";
	import GameTable from "./components/GameTable.svelte";
	import PlayerArea from "./components/PlayerArea.svelte";
	import RuleBox from "./components/RuleBox.svelte";

	import "./game.css";

	let worker: Worker | null = null;

	let roomId = $state("");
	let playerId = $state("");
	let role = $state("");
	let playerName = $state("");
	let playerCharacter = $state<any>(null);
	let playerIds = $state<string[]>([]);
	let playerNames = $state<string[]>([]);
	let playerCharacters = $state<any[]>([]);
	let playerRoles = $state<string[]>([]);
	let playerCards = $state<number[]>([]);
	let currentTurnPlayerId = $state("");
	let notes = $state("");

	let cards = $state<CardData[]>([]);
	let state = $state<CardData[]>([]);

	let ruleSubmitted = false;
	let ruleCode = $state("");

	let code = $state(`function rules(state) {
		return suit(last(state)) == "Spades";
	}`);

	onMount(() => {
		roomId = page.params.id;

		playerId = sessionStorage.getItem("playerId") ?? "";
		playerName = sessionStorage.getItem("playerName") ?? "";

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
						playerIds = msg.playerIds ?? [];
						playerNames = msg.playerNames ?? [];
						playerCharacters = msg.playerCharacters ?? [];
						playerRoles = msg.playerRoles ?? [];
						playerCards = msg.playerCards ?? [];
						currentTurnPlayerId = msg.currentTurnPlayerId ?? "";

						ruleSubmitted = msg.ruleSubmitted;

						if (role === "yardmaster") {
							ruleCode = msg.ruleCode;
						}
						break;

					case "updated":
						cards = msg.cards ?? [];
						state = msg.state ?? [];
						playerIds = msg.playerIds ?? [];
						playerNames = msg.playerNames ?? [];
						playerCharacters = msg.playerCharacters ?? [];
						playerRoles = msg.playerRoles ?? [];
						playerCards = msg.playerCards ?? [];
						currentTurnPlayerId = msg.currentTurnPlayerId ?? "";
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
				type: "module"
			}
		);
	}

	async function yieldRule() {
		send({
			type: "yield",
			roomId,
			playerId,
			playerName
		});
	}

	async function beSpectator() {
		send({
			type: "spectate",
			roomId,
			playerId
		});
	}

	async function beYarddog() {
		send({
			type: "yarddog",
			roomId,
			playerId
		});
	}

	async function play(card: CardData) {
		send({
			type: "play",
			roomId,
			playerId,
			card
		});
	}
</script>

<div class="game-page">
	<div class="floaters" aria-hidden="true">
		<span class="suit s1">♠</span>
		<span class="suit s2">♥</span>
		<span class="suit s3">♦</span>
		<span class="suit s4">♣</span>
		<span class="suit s5">♠</span>
		<span class="suit s6">♥</span>
		<span class="suit s7">♦</span>
		<span class="suit s8">♣</span>
	</div>

	<GameHeader {roomId} {role} />

	<main class="game-layout">
		<div class="players-area">
			<PlayersRow
				{playerName}
				{playerIds}
				{playerNames}
				{playerCharacters}
				{playerRoles}
				{playerCards}
				{currentTurnPlayerId}
			/>
		</div>

		<div class="table-area">
			<GameTable {state} />
		</div>

		<div class="bottom-area">
			<div class="player-area">
				<PlayerArea
					{playerName}
					{playerCharacter}
					{cards}
					{role}
					{ruleSubmitted}
					{play}
					{playerId}
					{currentTurnPlayerId}
				/>
			</div>

			<div class="rule-area">
				{#if role === "yardmaster"}
					<RuleBox
						{role}
						{ruleSubmitted}
						bind:code
						{submitRule}
						{yieldRule}
						{beSpectator}
						{beYarddog}
					/>
				{:else if role === "yarddog"}
					<div class="notes-box">
						<h2>Notes</h2>
						<textarea
							bind:value={notes}
							placeholder="Write down clues, ideas, or anything you want to remember..."
						></textarea>
					</div>
				{/if}
			</div>
		</div>
	</main>
	
	<section class="game-rules">
		<div class="rule-card">
			<h2>♠ How to Play</h2>

			<p>
				SASBMEAEG is a 2+ player card game built around finding the hidden pattern in a sequence of
				cards. It's a more mathematical, structured version of the Game of Mao that only includes the
				mechanical rules (those relating to the card itself) and none of the performance rules (those
				relating to the action of a player while playing a card).
			</p>

			<p>
				One player, the <strong>Yardmaster</strong>, defines the secret ruleset for that round, which
				determines whether a played card is correct or incorrect based on the previous sequence of
				cards. They then flip over one card (or more, depending on the ruleset) to start the sequence.
				The other players, <strong>Yard Dogs</strong>, take turns playing a card, and the Yardmaster
				says whether it fits the secret ruleset. If it's valid, the card is added to the sequence and
				the turn is complete. If it's invalid, the card is still added to the sequence but marked
				invalid with a slight vertical offset, and the player must draw another card from the deck
				before the turn is complete.
			</p>

			<p>
				After all Yard Dogs have played once, the Yardmaster plays a card, and the cycle repeats. The
				player who runs out of cards first — or alternatively, whoever first correctly learns the
				ruleset — becomes the Yardmaster in the next round. Yard Dogs are allowed to ask the Yardmaster
				for hints about the secret ruleset, within reason.
			</p>
		</div>

		<div class="rule-card">
			<h2>♥ Meta Rules</h2>

			<ol>
				<li>
					The secret ruleset must only pertain to physical qualities of the card (number, suit,
					color, symmetry, pip structure, etc.). That is, given only a ruleset and sequence of
					cards, it must be possible to reconstruct which cards are valid and which are invalid.
				</li>

				<li>
					The number of cards flipped at the start must be the exact amount needed for calculating
					the validity of the next card. For example, if the secret rule is "greater than the
					difference of the previous two cards," two cards must be flipped face-up at the start.
				</li>

				<li>
					The secret ruleset must contain no more than 5 operations, where an operation is one of
					the following: addition, subtraction, multiplication, modulus, validity. Exceptions can be
					made as long as the secret ruleset is sufficiently simple — for example, "last 5 cards
					must be a better poker hand than before."
				</li>

				<li>TODO</li>
			</ol>
		</div>
	</section>

</div>