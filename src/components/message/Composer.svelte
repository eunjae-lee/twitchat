<script lang="ts">
	import { sendTextMessage } from '$lib/db';
	import type { Room } from '$lib/types';
	import { getter, room as roomTexts } from '$lib/text';

	export let active: boolean;
	export let room: Room;

	const t = getter(roomTexts);
	let message: string = '';
	let submitting: boolean = false;
	let inputHeight = 2;
	let messageInputFocused: boolean = false;

	async function onSubmit() {
		if (!active || submitting || !message) {
			return;
		}
		submitting = true;
		await sendTextMessage({ room_id: room.id, message });
		message = '';
		submitting = false;
	}

	function onFocus() {
		messageInputFocused = true;
	}

	function onBlur() {
		messageInputFocused = false;
	}

	function onKeyDown(event: KeyboardEvent) {
		if (event.metaKey && event.key === 'Enter') {
			onSubmit();
		}
	}

	$: inputHeight = message.split('\n').length * 2;
</script>

<form class="fixed w-full bottom-0 p-3 flex gap-2" on:submit|preventDefault={onSubmit}>
	<textarea
		class="w-full text-base leading-7 textarea textarea-primary"
		bind:value={message}
		style:height="{inputHeight}rem"
		placeholder={t('placeholder')}
		disabled={!active}
		on:focus={onFocus}
		on:blur={onBlur}
		on:keydown={onKeyDown}
	/>
	{#if messageInputFocused || message.length > 0}
		<button type="submit" class="btn btn-primary">{t('send')}</button>
	{/if}
</form>
