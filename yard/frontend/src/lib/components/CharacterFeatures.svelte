<script lang="ts">
let { eyes, mouth }: { eyes: string; mouth: string } = $props();
</script>

{#if eyes === "Dot"}
	<circle cx="60" cy="68" r="7" fill="#090d18" />
	<circle cx="100" cy="68" r="7" fill="#090d18" />
{:else if eyes === "Sleepy"}
	<rect x="52" y="62" width="16" height="8" rx="4" fill="#090d18" />
	<rect x="92" y="62" width="16" height="8" rx="4" fill="#090d18" />
{:else if eyes === "Big"}
	<circle cx="60" cy="68" r="10" fill="#090d18" />
	<circle cx="100" cy="68" r="10" fill="#090d18" />
	<circle cx="63" cy="65" r="3" fill="white" />
	<circle cx="103" cy="65" r="3" fill="white" />
{:else if eyes === "Wide"}
	<circle cx="60" cy="68" r="13" fill="white" stroke="#090d18" stroke-width="5" />
	<circle cx="100" cy="68" r="13" fill="white" stroke="#090d18" stroke-width="5" />
	<circle cx="60" cy="68" r="5" fill="#090d18" />
	<circle cx="100" cy="68" r="5" fill="#090d18" />
{:else if eyes === "Angry"}
	<path d="M50 62 L70 70" stroke="#090d18" stroke-width="7" stroke-linecap="round" />
	<path d="M90 70 L110 62" stroke="#090d18" stroke-width="7" stroke-linecap="round" />
	<circle cx="60" cy="70" r="6" fill="#090d18" />
	<circle cx="100" cy="70" r="6" fill="#090d18" />
{:else if eyes === "Cross-Eyed"}
	<circle cx="60" cy="68" r="8" fill="#090d18" />
	<circle cx="100" cy="68" r="8" fill="#090d18" />
	<circle cx="64" cy="68" r="3" fill="white" />
	<circle cx="96" cy="68" r="3" fill="white" />
{:else if eyes === "Starry"}
	<path d="M60 55 L63 64 L72 64 L65 70 L68 79 L60 74 L52 79 L55 70 L48 64 L57 64 Z" fill="#090d18" />
	<path d="M100 55 L103 64 L112 64 L105 70 L108 79 L100 74 L92 79 L95 70 L88 64 L97 64 Z" fill="#090d18" />
{:else if eyes === "Laser"}
	<path d="M48 66 L72 66" stroke="#ff1744" stroke-width="6" stroke-linecap="round" />
	<path d="M88 66 L112 66" stroke="#ff1744" stroke-width="6" stroke-linecap="round" />
	<path d="M43 66 L35 62 M43 66 L35 70" stroke="#ff1744" stroke-width="3" />
	<path d="M117 66 L125 62 M117 66 L125 70" stroke="#ff1744" stroke-width="3" />
{:else if eyes === "Monocle"}
	<circle cx="60" cy="68" r="8" fill="none" stroke="#ffd166" stroke-width="4" />
	<circle cx="100" cy="68" r="7" fill="#090d18" />
	<path d="M52 61 Q60 55 68 61" fill="none" stroke="#ffd166" stroke-width="2" />
	<path d="M52 76 Q45 90 50 104" fill="none" stroke="#ffd166" stroke-width="2" />
{:else if eyes === "Glasses"}
	<circle cx="60" cy="68" r="15" fill="rgba(255,255,255,0.15)" stroke="#090d18" stroke-width="5" />
	<circle cx="100" cy="68" r="15" fill="rgba(255,255,255,0.15)" stroke="#090d18" stroke-width="5" />
	<path d="M75 68 L85 68" stroke="#090d18" stroke-width="5" />
	<path d="M45 64 L35 60 M115 64 L125 60" stroke="#090d18" stroke-width="4" />
{:else if eyes === "Shades"}
	<path d="M45 59 Q60 53 75 60 L72 77 Q60 83 48 76 Z" fill="#090d18" />
	<path d="M85 60 Q100 53 115 59 L112 76 Q100 83 88 77 Z" fill="#090d18" />
	<path d="M75 63 L85 63" stroke="#090d18" stroke-width="6" />
	<path d="M45 61 L35 58 M115 61 L125 58" stroke="#090d18" stroke-width="4" />
{:else if eyes === "Heart"}
	<path d="M60 78 L48 65 Q42 56 50 52 Q57 49 60 57 Q63 49 70 52 Q78 56 72 65 Z" fill="#ef476f" />
	<path d="M100 78 L88 65 Q82 56 90 52 Q97 49 100 57 Q103 49 110 52 Q118 56 112 65 Z" fill="#ef476f" />
{:else if eyes === "X"}
	<path d="M52 60 L68 76 M68 60 L52 76" stroke="#090d18" stroke-width="7" stroke-linecap="round" />
	<path d="M92 60 L108 76 M108 60 L92 76" stroke="#090d18" stroke-width="7" stroke-linecap="round" />
{:else if eyes === "Spiral"}
	<path d="M64 68 Q60 58 54 64 Q48 72 58 76 Q68 80 70 69 Q72 57 60 54" fill="none" stroke="#090d18" stroke-width="5" stroke-linecap="round" />
	<path d="M104 68 Q100 58 94 64 Q88 72 98 76 Q108 80 110 69 Q112 57 100 54" fill="none" stroke="#090d18" stroke-width="5" stroke-linecap="round" />
{:else if eyes === "Suspicious"}
	<path d="M50 57 Q60 51 70 58" fill="none" stroke="#090d18" stroke-width="6" stroke-linecap="round" />
	<path d="M90 58 Q100 51 110 57" fill="none" stroke="#090d18" stroke-width="6" stroke-linecap="round" />
	<circle cx="62" cy="69" r="6" fill="#090d18" />
	<circle cx="98" cy="69" r="6" fill="#090d18" />
{:else if eyes === "Robot"}
	<rect x="50" y="57" width="21" height="20" rx="3" fill="#b8c4ce" stroke="#090d18" stroke-width="5" />
	<rect x="89" y="57" width="21" height="20" rx="3" fill="#b8c4ce" stroke="#090d18" stroke-width="5" />
	<circle cx="60" cy="67" r="5" fill="#ef476f" />
	<circle cx="100" cy="67" r="5" fill="#ef476f" />
	<path d="M71 67 L89 67" stroke="#090d18" stroke-width="4" />
{:else if eyes === "Googly"}
	<circle cx="60" cy="68" r="12" fill="white" stroke="#090d18" stroke-width="4" />
	<circle cx="100" cy="68" r="12" fill="white" stroke="#090d18" stroke-width="4" />
	<circle cx="63" cy="70" r="5" fill="#090d18" />
	<circle cx="97" cy="65" r="5" fill="#090d18" />
{:else if eyes === "Anime"}
	<path d="M48 69 Q60 48 72 69 Q60 61 48 69 Z" fill="white" stroke="#090d18" stroke-width="4" />
	<path d="M88 69 Q100 48 112 69 Q100 61 88 69 Z" fill="white" stroke="#090d18" stroke-width="4" />
	<ellipse cx="60" cy="65" rx="5" ry="9" fill="#090d18" />
	<ellipse cx="100" cy="65" rx="5" ry="9" fill="#090d18" />
	<circle cx="62" cy="61" r="2" fill="white" />
	<circle cx="102" cy="61" r="2" fill="white" />
{:else if eyes === "Closed"}
	<path d="M50 68 Q60 76 70 68" fill="none" stroke="#090d18" stroke-width="6" stroke-linecap="round" />
	<path d="M90 68 Q100 76 110 68" fill="none" stroke="#090d18" stroke-width="6" stroke-linecap="round" />
{:else if eyes === "One-Eyed"}
	<circle cx="80" cy="68" r="16" fill="white" stroke="#090d18" stroke-width="5" />
	<circle cx="80" cy="68" r="7" fill="#090d18" />
{:else if eyes === "Three-Eyed"}
	<circle cx="50" cy="68" r="7" fill="#090d18" />
	<circle cx="80" cy="58" r="7" fill="#090d18" />
	<circle cx="110" cy="68" r="7" fill="#090d18" />
{:else if eyes === "Alien"}
	<ellipse cx="60" cy="67" rx="11" ry="16" fill="#090d18" />
	<ellipse cx="100" cy="67" rx="11" ry="16" fill="#090d18" />
	<ellipse cx="57" cy="63" rx="3" ry="5" fill="#06d6a0" />
	<ellipse cx="97" cy="63" rx="3" ry="5" fill="#06d6a0" />
{/if}

{#if mouth === "Smile"}
	<path
		d="M65 94 Q80 103 95 94"
		fill="none"
		stroke="#090d18"
		stroke-width="6"
		stroke-linecap="round"
	/>
{:else if mouth === "Flat"}
	<path
		d="M65 96 L95 96"
		fill="none"
		stroke="#090d18"
		stroke-width="6"
		stroke-linecap="round"
	/>
{:else if mouth === "Happy"}
	<path
		d="M65 94 Q80 108 95 94"
		fill="none"
		stroke="#090d18"
		stroke-width="6"
		stroke-linecap="round"
	/>
{:else if mouth === "Open"}
	<ellipse cx="80" cy="98" rx="15" ry="12" fill="#090d18" />
{:else if mouth === "Frown"}
	<path d="M65 104 Q80 94 95 104" fill="none" stroke="#090d18" stroke-width="6" stroke-linecap="round" />
{:else if mouth === "Grin"}
	<path d="M62 93 Q80 105 98 93 Q96 113 80 113 Q64 113 62 93 Z" fill="#090d18" />
{:else if mouth === "Teeth"}
	<path d="M63 94 Q80 103 97 94 L95 106 Q80 111 65 106 Z" fill="white" stroke="#090d18" stroke-width="4" />
{:else if mouth === "Fang"}
	<path d="M65 94 Q80 104 95 94" fill="none" stroke="#090d18" stroke-width="6" stroke-linecap="round" />
	<path d="M67 95 L70 107 L74 97 M86 97 L90 107 L93 95" fill="white" stroke="#090d18" stroke-width="2" />
{:else if mouth === "Vampire"}
	<path d="M64 94 Q80 104 96 94 Q94 108 80 110 Q66 108 64 94 Z" fill="#090d18" />
	<path d="M67 96 L70 106 L74 98 M86 98 L90 106 L93 96" fill="white" />
{:else if mouth === "Mustache"}
	<path d="M80 99 Q70 88 58 96 Q67 106 80 101 Q93 106 102 96 Q90 88 80 99 Z" fill="#090d18" />
{:else if mouth === "Big Mustache"}
	<path d="M80 100 Q68 86 52 96 Q62 112 80 103 Q98 112 108 96 Q92 86 80 100 Z" fill="#090d18" />
{:else if mouth === "Handlebar"}
	<path d="M80 99 Q69 91 60 96 Q53 100 48 94 Q50 108 62 107 Q72 106 80 101 Q88 106 98 107 Q110 108 112 94 Q107 100 100 96 Q91 91 80 99 Z" fill="#090d18" />
{:else if mouth === "Pipe"}
	<path d="M65 98 Q80 105 95 98" fill="none" stroke="#090d18" stroke-width="6" stroke-linecap="round" />
	<path d="M92 98 L108 108 L108 113" fill="none" stroke="#8b5a2b" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
	<path d="M104 111 Q108 105 112 111 Q108 117 104 111" fill="#d8d2c0" />
{:else if mouth === "Goatee"}
	<path d="M65 96 Q80 103 95 96" fill="none" stroke="#090d18" stroke-width="5" stroke-linecap="round" />
	<path d="M70 102 Q80 110 90 102 L86 115 Q80 121 74 115 Z" fill="#090d18" />
{:else if mouth === "Beard"}
	<path d="M60 94 Q80 103 100 94 L96 116 Q80 128 64 116 Z" fill="#090d18" />
	<path d="M68 105 Q80 111 92 105" fill="none" stroke="#f5f1e6" stroke-width="3" />
{:else if mouth === "Goofy"}
	<path d="M63 95 Q80 106 97 95 Q95 113 80 114 Q65 113 63 95 Z" fill="white" stroke="#090d18" stroke-width="4" />
	<path d="M72 101 L72 111 M80 102 L80 113 M88 101 L88 111" stroke="#090d18" stroke-width="2" />
{:else if mouth === "Surprised"}
	<ellipse cx="80" cy="99" rx="10" ry="14" fill="#090d18" />
{:else if mouth === "Yell"}
	<path d="M63 94 Q80 102 97 94 Q96 114 80 116 Q64 114 63 94 Z" fill="#090d18" />
	<path d="M69 108 Q80 102 91 108" stroke="#ef476f" stroke-width="5" stroke-linecap="round" />
{:else if mouth === "Whistle"}
	<circle cx="80" cy="99" r="9" fill="#090d18" />
	<circle cx="77" cy="96" r="2" fill="#f5f1e6" />
{:else if mouth === "Cat"}
	<path d="M66 96 Q80 104 94 96" fill="none" stroke="#090d18" stroke-width="5" stroke-linecap="round" />
	<path d="M80 96 L80 101 M80 101 L75 105 M80 101 L85 105" fill="none" stroke="#090d18" stroke-width="3" stroke-linecap="round" />
{:else if mouth === "Duck"}
	<ellipse cx="80" cy="99" rx="14" ry="9" fill="#ffd166" stroke="#090d18" stroke-width="4" />
	<path d="M68 98 Q80 94 92 98 Q80 102 68 98 Z" fill="#e6b94f" />
{:else if mouth === "Robot"}
	<rect x="64" y="91" width="32" height="18" rx="4" fill="#b8c4ce" stroke="#090d18" stroke-width="4" />
	<path d="M70 100 L76 100 M84 100 L90 100" stroke="#090d18" stroke-width="3" />
{:else if mouth === "Money"}
	<path d="M65 95 Q80 104 95 95" fill="none" stroke="#090d18" stroke-width="6" stroke-linecap="round" />
	<text x="80" y="109" text-anchor="middle" font-size="13" font-weight="bold" fill="#06d6a0">$</text>
{:else if mouth === "Tongue"}
	<path d="M64 94 Q80 103 96 94 Q94 110 80 112 Q66 110 64 94 Z" fill="#090d18" />
	<path d="M72 108 Q80 103 88 108 L87 116 Q80 122 73 116 Z" fill="#ef476f" />
{:else if mouth === "Derp"}
	<path d="M65 96 Q80 104 95 96" fill="none" stroke="#090d18" stroke-width="6" stroke-linecap="round" />
	<path d="M78 101 L84 110" stroke="#090d18" stroke-width="4" stroke-linecap="round" />
{:else if mouth === "UwU"}
	<path d="M62 98 Q70 90 78 98" fill="none" stroke="#090d18" stroke-width="5" stroke-linecap="round" />
	<path d="M82 98 Q90 90 98 98" fill="none" stroke="#090d18" stroke-width="5" stroke-linecap="round" />
{:else if mouth === "Evil"}
	<path d="M63 96 Q80 103 97 96 L94 108 L86 102 L80 109 L74 102 L66 108 Z" fill="#090d18" />
{:else if mouth === "Clown"}
	<ellipse cx="80" cy="99" rx="11" ry="9" fill="#ef476f" stroke="#090d18" stroke-width="3" />
	<circle cx="68" cy="96" r="5" fill="#ffd166" />
	<circle cx="92" cy="96" r="5" fill="#06d6a0" />
{:else if mouth === "Monocle Mustache"}
	<path d="M52 61 Q60 55 68 61" fill="none" stroke="#ffd166" stroke-width="2" />
	<circle cx="60" cy="68" r="9" fill="none" stroke="#ffd166" stroke-width="4" />
	<path d="M52 76 Q45 90 50 104" fill="none" stroke="#ffd166" stroke-width="2" />
	<path d="M80 99 Q69 89 58 96 Q68 107 80 101 Q92 107 102 96 Q91 89 80 99 Z" fill="#090d18" />
{/if}
