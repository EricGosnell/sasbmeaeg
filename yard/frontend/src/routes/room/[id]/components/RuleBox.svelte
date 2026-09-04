<script lang="ts">
	let {
		role,
		ruleSubmitted,
		code = $bindable(),
		submitRule,
		yieldRule,
		beSpectator,
		beYarddog,
		playerId,
		playerIds,
		playerNames,
		playerRoles
	} = $props();

	let showYardmasterMenu = $state(false);

	const yardDogs = $derived(
		playerIds
			.map((id, index) => ({
				id,
				name: playerNames[index] ?? "Unknown Player",
				role: playerRoles[index] ?? ""
			}))
			.filter(
				(player) =>
					player.role === "yarddog" &&
					player.id !== playerId
			)
	);

	function selectYardmaster(id: string) {
		showYardmasterMenu = false;
		yieldRule(id);
	}
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

				<div class="yield-container">
					<button
						class="yield-button"
						onclick={() => showYardmasterMenu = !showYardmasterMenu}
					>
						Yield Rule
						<span class:rotated={showYardmasterMenu}>▾</span>
					</button>

					{#if showYardmasterMenu}
						<div class="yardmaster-menu">
							{#if yardDogs.length > 0}
								{#each yardDogs as player}
									<button
										class="yardmaster-option"
										onclick={() => selectYardmaster(player.id)}
									>
										{player.name}
									</button>
								{/each}
							{:else}
								<div class="no-yard-dogs">
									No other Yard Dogs
								</div>
							{/if}
						</div>
					{/if}
				</div>
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
		background: #5ed482ff;
		color: #1b3a2f;
	}

	.yield-container {
		position: relative;
	}

	.yield-button {
		background: #ef476f;
		color: white;
	}

	.yield-button span {
		display: inline-block;
		margin-left: 6px;
		transition: transform 0.15s ease;
	}

	.yield-button span.rotated {
		transform: rotate(180deg);
	}

	.yardmaster-menu {
		position: absolute;
		left: 0;
		top: calc(100% + 6px);
		min-width: 180px;
		padding: 6px;

		background: #252d2c;
		border: 1px solid #4a5653;
		border-radius: 10px;

		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
		z-index: 20;
	}

	.yardmaster-option {
		display: block;
		width: 100%;
		padding: 9px 12px;

		background: transparent;
		color: #f5f1e6;

		text-align: left;
		font-weight: 600;
		border-radius: 7px;
	}

	.yardmaster-option:hover {
		background: rgba(6, 214, 160, 0.15);
		transform: none;
	}

	.no-yard-dogs {
		padding: 10px 12px;
		color: #858e8a;
		font-size: 0.9rem;
	}

	.secondary-button {
		background: #06d6a0;
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

		.yield-container {
			width: 100%;
		}

		.yield-button {
			width: 100%;
		}

		.yardmaster-menu {
			width: 100%;
			box-sizing: border-box;
		}
	}
</style>
