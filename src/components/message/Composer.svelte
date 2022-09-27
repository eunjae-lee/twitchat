<script lang="ts">
	import { sendEmojiMessage, sendTextMessage } from '$lib/db';
	import type { Room } from '$lib/types';
	import { getter, room as roomTexts } from '$lib/text';
	import { onDestroy, onMount } from 'svelte';
	import { createPicker } from 'picmo';
	import FilledHeart from '../icons/FilledHeart.svelte';

	export let active: boolean;
	export let room: Room;
	export let onNewMessage: (params: { content: string; type: string }) => void;

	const t = getter(roomTexts);
	let emojiModal: HTMLElement;
	let emojiPickerContainer: HTMLElement;
	let emojiModalCheck: HTMLInputElement;
	let textArea: HTMLTextAreaElement;
	let message: string = '';
	let submitting: boolean;
	let inputHeight = 2;
	let messageInputFocused: boolean = false;

	async function onSubmit() {
		if (!active || submitting || !message) {
			return;
		}
		textArea.focus();
		onNewMessage({ content: message, type: 'text' });
		const messageToSend = message;
		message = '';
		submitting = true;
		await sendTextMessage({ room_id: room.id, message: messageToSend });
		submitting = false;
	}

	function onFocus() {
		messageInputFocused = true;
	}

	function onBlur() {
		messageInputFocused = false;
	}

	function onKeyDown(event: KeyboardEvent) {
		if (!event.shiftKey && event.key === 'Enter') {
			event.preventDefault();
			onSubmit();
		}
	}

	$: inputHeight = message.split('\n').length * 2;

	function keyListener(event: KeyboardEvent) {
		if (event.code === 'Escape' && emojiModalCheck.value === 'on') {
			emojiModal.click(); // hide the modal
		}
	}

	onMount(async () => {
		const picker = createPicker({
			rootElement: emojiPickerContainer,
		});
		picker.addEventListener('emoji:select', (selection) => {
			emojiModal.click();
			sendEmojiMessage({ room_id: room.id, emoji: JSON.stringify(selection) });
		});

		window.addEventListener('keyup', keyListener);
	});

	onDestroy(() => {
		window.removeEventListener('keyup', keyListener);
	});
</script>

<form class="w-full p-3 flex gap-2" on:submit|preventDefault={onSubmit}>
	<textarea
		class="w-full text-base leading-7 textarea textarea-primary"
		bind:this={textArea}
		bind:value={message}
		style:height="{inputHeight}rem"
		placeholder={t('placeholder')}
		disabled={!active}
		on:focus={onFocus}
		on:blur={onBlur}
		on:keydown={onKeyDown}
	/>
	{#if messageInputFocused || message.length > 0}
		<button type="submit" class="btn btn-primary" disabled={submitting}>{t('send')}</button>
	{:else}
		<label for="modal-emoji" class="btn btn-ghost text-primary px-3"><FilledHeart /></label>
	{/if}
</form>

<input type="checkbox" id="modal-emoji" class="modal-toggle" bind:this={emojiModalCheck} />
<label for="modal-emoji" class="modal cursor-pointer" bind:this={emojiModal}>
	<label
		class="modal-box relative rounded-sm p-0 w-[initial]"
		for=""
		bind:this={emojiPickerContainer}
	/>
</label>

<style>
	:global(.picmo-picker .searchContainer .searchField) {
		font-size: 1rem !important;
	}
</style>
