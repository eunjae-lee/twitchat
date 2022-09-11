<script lang="ts">
	import { makeItTwo } from '$lib/number';

	import { getter, duration } from '$lib/text';
	import { onDestroy, onMount } from 'svelte';

	export let creating: boolean = false;
	export let end_ts: string | undefined = undefined;

	let timeLeft: string;

	const t = getter(duration);
	let showingDurationInfo: boolean;

	let intervalId: NodeJS.Timer | undefined;

	if (end_ts) {
		onMount(() => {
			intervalId = setInterval(() => {
				let seconds = (new Date(end_ts!).getTime() - new Date().getTime()) / 1000;
				let minutes = Math.floor(seconds / 60);
				seconds = Math.floor(seconds % 60);
				let hours = 0;
				if (minutes > 60) {
					hours = Math.floor(minutes / 60);
					minutes = minutes % 60;
				}
				timeLeft = `${makeItTwo(minutes)}m ${makeItTwo(seconds)}s`;
				if (hours > 0) {
					timeLeft = `${hours}h ${timeLeft}`;
				}
			}, 1000);
		});

		onDestroy(() => {
			if (intervalId) {
				clearInterval(intervalId);
				intervalId = undefined;
			}
		});
	}
</script>

<div class="flex justify-end">
	<button
		type="button"
		class="btn btn-xs btn-ghost flex items-center gap-1"
		on:click={() => {
			showingDurationInfo = !showingDurationInfo;
		}}
	>
		<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
			/>
		</svg>
		<span class="text-xs opacity-75">{t('durationLabel')}</span>
	</button>
</div>
{#if showingDurationInfo}
	<div class="mt-1 alert shadow-sm text-sm">
		<ol class="ml-4 list-disc flex flex-col items-start gap-2">
			{#if end_ts}
				<li>{t('expiresIn')}: <span class="tabular-nums">{timeLeft}</span></li>
			{:else}
				<li>{t('durationMessage1')}</li>
			{/if}
			<li>{t('durationMessage2')}</li>
			<li>{t('durationMessage3')}</li>
			{#if creating}
				<li>{t('durationMessage4')}</li>
			{/if}
		</ol>
	</div>
{/if}
