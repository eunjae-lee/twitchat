<script lang="ts">
	import { makeItTwo } from '$lib/number';
	import type { Message, Participation } from '$lib/types';
	import { getter, room as roomTexts } from '$lib/text';
	import Bubble from './Bubble.svelte';

	export let message: Message;
	export let participation: Participation;
	export let isMine: boolean;

	const t = getter(roomTexts);

	function formatTime(date: Date) {
		return `${makeItTwo(date.getHours())}:${makeItTwo(date.getMinutes())}`;
	}

	function hideDropdown() {
		(document?.activeElement as HTMLElement)?.blur();
	}

	let messageTime = formatTime(new Date(message.created_ts));
	let isLocalTempMessage = message.id.startsWith('temp_');
</script>

{#if message.type === 'text' && message.content}
	<div class="flex" class:justify-end={isMine}>
		{#if isMine}
			<div class="flex items-end gap-2">
				{#if isLocalTempMessage}
					<svg
						class="animate-spin mb-1 h-4 w-4"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							class="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="4"
						/>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						/>
					</svg>
					<span class="sr-only">{t('sending')}</span>
				{:else}
					<span class="text-xs opacity-75 mb-1">{messageTime}</span>
				{/if}
				<Bubble content={message.content} />
				{#if false}
					<div class="dropdown dropdown-end">
						<!-- svelte-ignore a11y-label-has-associated-control -->
						<label tabindex="0"><Bubble content={message.content ?? ''} /></label>
						<ul
							tabindex="0"
							class="mt-1 dropdown-content menu p-2 shadow bg-base-200 rounded-box w-36"
						>
							<li>
								<button
									on:click={() => {
										hideDropdown();
										confirm('...');
									}}
									type="button"
									><svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="w-6 h-6"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46"
										/>
									</svg>
									<span>Notice</span></button
								>
							</li>
						</ul>
					</div>
				{/if}
			</div>
		{:else}
			<div class="flex gap-2" aria-hidden>
				<a class="shrink-0" href={`https://twitter.com/${participation.user_name}`} target="_blank"
					><img
						class="mt-1 rounded-full w-12 h-12"
						src={participation.picture}
						alt={`Profile picture of ${participation.full_name}`}
					/></a
				>
				<div>
					<p class="text-sm">{participation.full_name}</p>
					<div class="flex items-end gap-2">
						<Bubble content={message.content} />
						<span class="text-xs opacity-75 mb-1">{messageTime}</span>
					</div>
				</div>
			</div>
			<p class="sr-only">
				<span>{participation.full_name}</span>
				<span>{message.content}</span>
				<span>{messageTime}</span>
			</p>
		{/if}
	</div>
{/if}
