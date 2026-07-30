<script lang="ts">
	let code = $state(`function rules(state) {
	return suit(last(state)) == "Spades";
}`);

let history = $state<Card[]>([]);
let result = $state("");

	let worker: Worker | null = null;
    let submitted = false;

	type Card = {
		rank: string;
		suit: string;
	};

	function runRule() {
        try {
            worker?.terminate();

            worker = new Worker(
                new URL(
                    "../../lib/ruleWorker.ts",
                    import.meta.url
                ),
                {
                    type: "module"
                }
            );

            submitted = true;

            result = "Rule loaded!";

        } catch (e) {
            result = "Worker error: " + e;
        }
    }
	
    function play(card: Card) {
        history = [...history, card];

        if (!worker || !submitted) {
            result = "Submit a rule first";
            return;
        }

        worker.onmessage = (event) => {

            if (event.data.ok) {
                result = event.data.result
                    ? "Good"
                    : "Bad";
            } else {
                result = "Rule error: "
                    + event.data.error;
            }
        };


        worker.postMessage({
            code,
            state: $state.snapshot(history)
        });
    }
</script>

<h1>SASBMEAEG Rule Tester</h1>

<textarea
	bind:value={code}
	rows="12"
	cols="80"
></textarea>

<br />

<button onclick={runRule}>
	Submit Rule
</button>

<hr />

<button onclick={() => play({
	rank: "A",
	suit: "Spades"
})}>
	Up (Ace of Spades)
</button>

<button onclick={() => play({
	rank: "2",
	suit: "Diamonds"
})}>
	Down (2 of Diamonds)
</button>

<h2>Result:</h2>

<p>{result}</p>

<h2>Sequence:</h2>

<ul>
	{#each history as card}
		<li>
			{card.rank} of {card.suit}
		</li>
	{/each}
</ul>