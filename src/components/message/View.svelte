<script lang="ts">
	import { makeItTwo } from '$lib/number';

	import type { Message, Participation } from '$lib/types';
	import Bubble from './Bubble.svelte';

	export let message: Message;
	export let participation: Participation;
	export let isMine: boolean;

	function formatTime(date: Date) {
		return `${makeItTwo(date.getHours())}:${makeItTwo(date.getMinutes())}`;
	}

	let messageTime = formatTime(new Date(message.created_ts));
</script>

{#if message.type === 'text' && message.content}
	<div class="flex" class:justify-end={isMine}>
		{#if isMine}
			<div class="flex items-end gap-2">
				<span class="text-xs opacity-75 mb-1">{messageTime}</span>
				<Bubble content={message.content} />
			</div>
		{:else}
			<div class="flex gap-2">
				<img
					class="mt-1 rounded-full w-12 h-12"
					src={participation.picture}
					alt={`Profile picture of ${participation.full_name}`}
				/>
				<div>
					<p class="text-sm">{participation.full_name}</p>
					<p class="text-xs opacity-75">@{participation.user_name}</p>
					<div class="flex items-end gap-2">
						<Bubble content={message.content} />
						<span class="text-xs opacity-75 mb-1">{messageTime}</span>
					</div>
				</div>
			</div>
		{/if}
	</div>
{/if}
