<script lang="ts">
	let {
		role,
		ruleSubmitted,
		code = $bindable(),
		submitRule,
		yieldRule,
		beSpectator,
		beYarddog
	} = $props();
</script>

<section class="rule-box">
	{#if role === "yardmaster"}
		<div class="rule-header">
			<h2>Your Secret Rule</h2>
		</div>

		<textarea
			bind:value={code}
			rows="10"
			disabled={ruleSubmitted}
		></textarea>

		<div class="rule-actions">
			{#if !ruleSubmitted}
				<button
					class="submit-button"
					onclick={submitRule}
				>
					Submit Rule
				</button>

				<input
					bind:value={code}
					placeholder="New Yardmaster"
				/>

				<button
					class="yield-button"
					onclick={yieldRule}
				>
					Yield Rule
				</button>
			{/if}
		</div>
	{:else if role === "yarddog"}
		{#if !ruleSubmitted}
			<button
				class="secondary-button"
				onclick={beSpectator}
			>
				Be Spectator
			</button>
		{/if}
	{:else if role === "spectator"}
		{#if !ruleSubmitted}
			<button
				class="secondary-button"
				onclick={beYarddog}
			>
				Be Yarddog
			</button>
		{/if}
	{/if}
</section>

<style>
	.rule-box {
		width: 100%;
		box-sizing: border-box;
		padding: 18px;
		background: rgba(245, 241, 230, 0.06);
		border: 2px solid rgba(255, 255, 255, 0.12);
		border-radius: 16px;
	}

	.rule-header h2 {
		margin: 0 0 12px;
		color: #ffd166;
		font-size: 1.2rem;
	}

	textarea {
		display: block;
		width: 100%;
		min-height: 180px;
		box-sizing: border-box;
		padding: 12px;
		resize: vertical;
		border: 2px solid rgba(255, 255, 255, 0.15);
		border-radius: 10px;
		background: #101a14;
		color: #f5f1e6;
		font-family: monospace;
		font-size: 0.95rem;
		line-height: 1.5;
	}

	textarea:disabled {
		opacity: 0.7;
	}

	.rule-actions {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: 12px;
		flex-wrap: wrap;
	}

	button {
		padding: 10px 18px;
		border: none;
		border-radius: 10px;
		font-size: 0.95rem;
		font-weight: 700;
		cursor: pointer;
	}

	.submit-button {
		background: #ffd166;
		color: #1b3a2f;
	}

	.yield-button {
		background: #ef476f;
		color: white;
	}

	.secondary-button {
		background: #06d6a0;
		color: #0f2419;
	}

	input {
		width: 160px;
		padding: 10px 12px;
		box-sizing: border-box;
		border: 2px solid #d8d2c0;
		border-radius: 10px;
		background: #f5f1e6;
		color: #0f2419;
	}

	@media (max-width: 700px) {
		.rule-box {
			padding: 12px;
		}

		textarea {
			min-height: 140px;
		}

		.rule-actions {
			flex-direction: column;
			align-items: stretch;
		}

		input {
			width: 100%;
		}
	}
</style>
