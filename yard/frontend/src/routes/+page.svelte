<script lang="ts">
import { connect, send } from "$lib/client/gameClient.js";
import "$lib/styles/landing.css";

let playerName = $state("");
let roomId = $state("");

async function createRoom(){
	const playerId = crypto.randomUUID();

	sessionStorage.setItem("playerId", playerId);
	sessionStorage.setItem("playerName", playerName);

	connect(
		(msg)=>{
			if (msg.type === "created") {
				window.location.href =
					"/room/" +
					msg.roomId;
			}
		},
		()=>{
			send({
				type:"create",
				playerId
			});
		}
	);
}

function joinRoom() {
	if (!roomId.trim()) {
		alert("Please enter a room ID");
		return;
	}

	const playerId = crypto.randomUUID();

	sessionStorage.setItem("playerId", playerId);
	sessionStorage.setItem("playerName", playerName);

	connect(
		(msg) => {
			if (msg.type === "error") {
				alert(msg.message);
				return;
			}

			if (msg.type === "exists") {
				window.location.href = "/room/" + roomId;
			}
		},
		() => {
			send({
				type: "check",
				roomId,
				playerName
			});
		}
	);
}

</script>

<div class="page">

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

	<header class="hero">
		<h1>SASBMEAEG</h1>
		<p class="tagline">Sequences and Series by Max Eaton and Eric Gosnell</p>

		<div class="actions">

			<div class="name-row">
				<label for="playerName">Player Name:</label>
				<input
					id="playerName"
					bind:value={playerName}
					placeholder="Random Name"
				/>
			</div>

			<button class="primary" onclick={createRoom}>
				Create Room
			</button>

			<div class="join">
				<input
					bind:value={roomId}
					placeholder="Room ID"
				/>
				<button class="secondary" onclick={joinRoom}>
					Join Room →
				</button>
			</div>
		</div>
	</header>

	<section class="rules">

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

		<div class="rule-card">
			<h2>♦ Existing Rulesets</h2>
			<p>
				The best rulesets are simple yet creative. A Yardmaster who wishes to remain as such should
				aim to minimize the chance of a randomly played card being correct, while simultaneously
				maximizing the chance they can always play a correct card. You can determine these two chances
				using the provided Monte Carlo simulation against randomly-playing Yard Dogs.
			</p>
			<p>
				The following rulesets are some of our favorites we have played, which have been added into
				the ruleset library:
			</p>
			<ol>
				<li>TODO</li>
			</ol>
		</div>

	</section>

</div>