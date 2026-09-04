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
	<GameHeader {roomId} />

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
				/>
			</div>

			<div class="rule-area">
				<RuleBox
					{role}
					{ruleSubmitted}
					bind:code
					{submitRule}
					{yieldRule}
					{beSpectator}
					{beYarddog}
				/>
			</div>
		</div>
	</main>
</div>