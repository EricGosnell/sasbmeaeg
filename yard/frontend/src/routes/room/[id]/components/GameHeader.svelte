<script lang="ts">
	let { roomId, role }: { roomId: string; role: string } = $props();
</script>

<header class="game-header">
	<div class="room-id">
		Room {roomId}
	</div>

	{#if role === "yardmaster"}
		<button class="end-game" type="button">
			End Game
		</button>
	{:else}
		<button class="end-game" type="button">
			Leave Game
		</button>
	{/if}
</header>


<style>
	.game-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		margin: 0 auto 20px;
		padding: 14px 18px;
		box-sizing: border-box;
		background: rgba(245, 241, 230, 0.06);
		border: 2px solid rgba(255, 255, 255, 0.12);
		border-radius: 14px;
	}

	.room-id {
		font-size: 1.15rem;
		font-weight: 700;
		color: #f5f1e6;
	}

	.end-game {
		padding: 10px 18px;
		border: none;
		border-radius: 10px;
		background: #ef476f;
		color: #fff;
		font-size: 0.95rem;
		font-weight: 700;
		cursor: pointer;
	}

	.end-game:hover {
		background: #d9365e;
	}

	@media (max-width: 500px) {
		.game-header {
			margin-bottom: 12px;
			padding: 10px 12px;
		}

		.end-game {
			padding: 8px 12px;
		}
	}
</style>
