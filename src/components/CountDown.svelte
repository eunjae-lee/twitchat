<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { makeItTwo } from '$lib/number';
	import { getter, room as roomTexts } from '$lib/text';
	const t = getter(roomTexts);

	export let end_ts: string;
	export let onClosed: () => void;
	$: secondsLeft = (new Date(end_ts).getTime() - new Date().getTime()) / 1000;
	let intervalId: NodeJS.Timer | undefined;

	let timerStr: string | undefined;
	let level: 'warning' | 'error' | 'closed' | undefined;

	const WARNING_TIME = 60 * 3;
	const ERROR_TIME = 60;

	let Confetti: any;

	onMount(() => {
		// load js-confetti asynchronously because we don't need it immediately
		import('js-confetti').then((module) => {
			Confetti = module.default;
		});

		intervalId = setInterval(() => {
			secondsLeft -= 1;
			if (secondsLeft < 0) {
				level = 'closed';
				clearInterval(intervalId);
				intervalId = undefined;
				onClosed();
				if (Confetti) {
					new Confetti().addConfetti({
						emojis: ['🌈', '⚡️', '💥', '✨', '💫', '🌸'],
					});
				}
				return;
			}

			if (secondsLeft <= WARNING_TIME) {
				timerStr = `${makeItTwo(Math.floor(secondsLeft / 60))}:${makeItTwo(
					Math.floor(secondsLeft % 60)
				)}`;
			}

			if (secondsLeft <= ERROR_TIME) {
				level = 'error';
			} else if (secondsLeft <= WARNING_TIME) {
				level = 'warning';
			}
		}, 1000);
	});

	onDestroy(() => {
		if (intervalId) {
			clearInterval(intervalId);
		}
	});
</script>

{#if level !== undefined}
	<div
		class:bg-warning={level === 'warning'}
		class:text-warning-content={level === 'warning'}
		class:bg-error={level === 'error'}
		class:text-error-content={level === 'error'}
		class:animate-pulse={level === 'error'}
		class:bg-neutral={level === 'closed'}
		class:text-neutral-content={level === 'closed'}
		class="rounded-md py-1 px-2 flex gap-1 items-center"
	>
		<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
			/>
		</svg>
		<span class="sr-only">{t('remainingTime')}</span>
		<span class="tabular-nums">{level === 'closed' ? t('closed') : timerStr}</span>
	</div>
{/if}
