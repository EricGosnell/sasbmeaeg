<script lang="ts">
import { connect, send } from "$lib/client/gameClient.js";
import CharacterFeatures from "$lib/components/CharacterFeatures.svelte";
import "$lib/styles/landing.css";

let playerName = $state("");
let roomId = $state("");

let selectedColor = $state(2);
let selectedEyes = $state(2);
let selectedMouth = $state(0);

const colors = [
	{ name: "Purple", head: "#b000ff", body: "#a000e8" },
	{ name: "Blue", head: "#168cff", body: "#0874d9" },
	{ name: "Green", head: "#06d6a0", body: "#05b889" },
	{ name: "Red", head: "#ef476f", body: "#d9365e" },
	{ name: "Yellow", head: "#ffd166", body: "#e6b94f" },
	{ name: "Orange", head: "#ff8c42", body: "#e66f26" },
	{ name: "Pink", head: "#ff5ca8", body: "#e6428b" },
	{ name: "Cyan", head: "#22d3ee", body: "#0ea5c9" },
	{ name: "Teal", head: "#14b8a6", body: "#0f9488" },
	{ name: "Lime", head: "#a3e635", body: "#7fbd24" },
	{ name: "Gold", head: "#fbbf24", body: "#d99a12" },
	{ name: "Coral", head: "#ff6b6b", body: "#e94f4f" },
	{ name: "Lavender", head: "#c084fc", body: "#a855f7" },
	{ name: "Mint", head: "#6ee7b7", body: "#34c995" },
	{ name: "Sky", head: "#38bdf8", body: "#199bd1" },
	{ name: "White", head: "#f5f1e6", body: "#d8d2c0" },
	{ name: "Black", head: "#343a40", body: "#212529" }
];

const eyes = [
	"Dot",
	"Sleepy",
	"Big",
	"Wide",
	"Angry",
	"Cross-Eyed",
	"Starry",
	"Laser",
	"Monocle",
	"Glasses",
	"Shades",
	"Heart",
	"X",
	"Spiral",
	"Suspicious",
	"Robot",
	"Googly",
	"Anime",
	"Closed",
	"One-Eyed",
	"Three-Eyed",
	"Alien"
];

const mouths = [
	"Smile",
	"Flat",
	"Happy",
	"Open",
	"Frown",
	"Grin",
	"Teeth",
	"Fang",
	"Vampire",
	"Mustache",
	"Big Mustache",
	"Handlebar",
	"Pipe",
	"Goatee",
	"Beard",
	"Goofy",
	"Surprised",
	"Yell",
	"Whistle",
	"Cat",
	"Duck",
	"Robot",
	"Money",
	"Tongue",
	"Derp",
	"UwU",
	"Evil",
	"Clown",
	"Monocle Mustache"
];

function getCharacter() {
	return {
		color: colors[selectedColor].name,
		eyes: eyes[selectedEyes],
		mouth: mouths[selectedMouth]
	};
}

function randomizeCharacter() {
	selectedColor = Math.floor(Math.random() * colors.length);
	selectedEyes = Math.floor(Math.random() * eyes.length);
	selectedMouth = Math.floor(Math.random() * mouths.length);
}

function savePlayer() {
	sessionStorage.setItem("playerName", playerName);
	sessionStorage.setItem("playerCharacter", JSON.stringify(getCharacter()));
}

async function createRoom(){
	const playerId = crypto.randomUUID();

	sessionStorage.setItem("playerId", playerId);
	savePlayer();

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
				playerId,
				character: getCharacter()
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
	savePlayer();

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
				<input
					id="playerName"
					bind:value={playerName}
					placeholder="Enter Your Name"
				/>
			</div>

			<div class="character-picker">

				<div class="character-label color-label">
					Color
				</div>

				<button
					class="carousel-arrow color-left"
					type="button"
					onclick={() => selectedColor = (selectedColor - 1 + colors.length) % colors.length}
					aria-label="Previous color"
				>
					‹
				</button>

				<div class="character-preview">
					<svg
						viewBox="0 0 160 180"
						class="character"
						role="img"
						aria-label="Character preview"
					>
						<path
							d="M40 175
								C43 145 60 128 80 128
								C100 128 117 145 120 175
								Z"
							fill={colors[selectedColor].body}
							stroke="#090d18"
							stroke-width="7"
							stroke-linejoin="round"
						/>

						<circle
							cx="80"
							cy="75"
							r="52"
							fill={colors[selectedColor].head}
							stroke="#090d18"
							stroke-width="7"
						/>

						<CharacterFeatures
							eyes={eyes[selectedEyes]}
							mouth={mouths[selectedMouth]}
						/>
					</svg>
				</div>

				<button
					class="carousel-arrow color-right"
					type="button"
					onclick={() => selectedColor = (selectedColor + 1) % colors.length}
					aria-label="Next color"
				>
					›
				</button>

				<button
					class="randomize-button"
					type="button"
					onclick={randomizeCharacter}
					aria-label="Randomize character"
				>
					<svg
						viewBox="0 0 48 48"
						width="30"
						height="30"
						aria-hidden="true"
					>
						<path
							d="M24 4 L42 14 L24 24 L6 14 Z"
							fill="#f5f1e6"
						/>
						<path
							d="M6 14 L24 24 L24 44 L6 34 Z"
							fill="#d8d2c0"
						/>
						<path
							d="M42 14 L24 24 L24 44 L42 34 Z"
							fill="#aaa493"
						/>
						<circle cx="15" cy="29" r="2.5" fill="#1b3a2f" />
						<circle cx="30" cy="31" r="2.5" fill="#1b3a2f" />
						<circle cx="37" cy="28" r="2.5" fill="#1b3a2f" />
						<circle cx="24" cy="9" r="2.5" fill="#1b3a2f" />
						<circle cx="34" cy="14" r="2.5" fill="#1b3a2f" />
						<circle cx="14" cy="14" r="2.5" fill="#1b3a2f" />
						<circle cx="24" cy="18" r="2.5" fill="#1b3a2f" />

					</svg>
				</button>

				<div class="character-label eyes-label">
					Eyes
				</div>

				<button
					class="carousel-arrow eyes-left"
					type="button"
					onclick={() => selectedEyes = (selectedEyes - 1 + eyes.length) % eyes.length}
					aria-label="Previous eyes"
				>
					‹
				</button>

				<button
					class="carousel-arrow eyes-right"
					type="button"
					onclick={() => selectedEyes = (selectedEyes + 1) % eyes.length}
					aria-label="Next eyes"
				>
					›
				</button>

				<div class="character-label mouth-label">
					Mouth
				</div>

				<button
					class="carousel-arrow mouth-left"
					type="button"
					onclick={() => selectedMouth = (selectedMouth - 1 + mouths.length) % mouths.length}
					aria-label="Previous mouth"
				>
					‹
				</button>

				<button
					class="carousel-arrow mouth-right"
					type="button"
					onclick={() => selectedMouth = (selectedMouth + 1) % mouths.length}
					aria-label="Next mouth"
				>
					›
				</button>

			</div>

			<p></p>

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