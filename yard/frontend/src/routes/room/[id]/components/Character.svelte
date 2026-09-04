<script lang="ts">
	import CharacterFeatures from "$lib/components/CharacterFeatures.svelte";

	let {
		character,
		size = "normal",
		ariaLabel = "Character"
	}: {
		character: any;
		size?: "small" | "normal" | "large";
		ariaLabel?: string;
	} = $props();

	const colors: Record<string, { head: string; body: string }> = {
		Purple: {
			head: "#b000ff",
			body: "#a000e8"
		},
		Blue: {
			head: "#168cff",
			body: "#0874d9"
		},
		Green: {
			head: "#06d6a0",
			body: "#05b889"
		},
		Red: {
			head: "#ef476f",
			body: "#d9365e"
		},
		Yellow: {
			head: "#ffd166",
			body: "#e6b94f"
		},
		Orange: {
			head: "#ff8c42",
			body: "#e66f26"
		},
		Pink: {
			head: "#ff5ca8",
			body: "#e6428b"
		},
		Cyan: {
			head: "#22d3ee",
			body: "#0ea5c9"
		},
		Teal: {
			head: "#14b8a6",
			body: "#0f9488"
		},
		Lime: {
			head: "#a3e635",
			body: "#7fbd24"
		},
		Gold: {
			head: "#fbbf24",
			body: "#d99a12"
		},
		Coral: {
			head: "#ff6b6b",
			body: "#e94f4f"
		},
		Lavender: {
			head: "#c084fc",
			body: "#a855f7"
		},
		Mint: {
			head: "#6ee7b7",
			body: "#34c995"
		},
		Sky: {
			head: "#38bdf8",
			body: "#199bd1"
		},
		White: {
			head: "#f5f1e6",
			body: "#d8d2c0"
		},
		Black: {
			head: "#343a40",
			body: "#212529"
		}
	};

	const defaultColor = colors.Purple;

	function characterColor(character: any) {
		return colors[character?.color] ?? defaultColor;
	}

	let color = $derived(characterColor(character));
</script>

{#if character}
	<svg
		viewBox="0 0 160 180"
		class:small={size === "small"}
		class:normal={size === "normal"}
		class:large={size === "large"}
		role="img"
		aria-label={ariaLabel}
	>
		<path
			d="M40 175
				C43 145 60 128 80 128
				C100 128 117 145 120 175
				Z"
			fill={color.body}
			stroke="#090d18"
			stroke-width="7"
			stroke-linejoin="round"
		/>

		<circle
			cx="80"
			cy="75"
			r="52"
			fill={color.head}
			stroke="#090d18"
			stroke-width="7"
		/>

		<CharacterFeatures
			eyes={character.eyes}
			mouth={character.mouth}
		/>
	</svg>
{/if}

<style>
	svg {
		display: block;
		flex-shrink: 0;
		filter: drop-shadow(0 6px 6px rgba(0, 0, 0, 0.25));
	}

	svg.small {
		width: 48px;
		height: 54px;
	}

	svg.normal {
		width: 90px;
		height: 110px;
	}

	svg.large {
		width: 120px;
		height: 140px;
	}
</style>
