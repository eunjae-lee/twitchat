<script lang="ts">
	import { getter, duration } from '$lib/text';
	const t = getter(duration);
	let showingDurationInfo: boolean;
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
			<li>{t('durationMessage1')}</li>
			<li>{t('durationMessage2')}</li>
			<li>{t('durationMessage3')}</li>
		</ol>
	</div>
{/if}
