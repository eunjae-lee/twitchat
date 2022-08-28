<script lang="ts">
	import { sendTextMessage } from '$lib/db';
	import type { Room } from '$lib/types';
	import { getter, room as roomTexts } from '$lib/text';
	import { subscribeToMessages, subscribeToParticipations } from '$lib/room';
	import { onDestroy } from 'svelte';
	import MessageComp from './Message.svelte';

	export let room: Room;

	let message: string;
	let ready: boolean = false;
	let submitting: boolean = false;
	const t = getter(roomTexts);

	const {
		state: roomState,
		messages,
		unsubscribe: unsubscribeMessages,
	} = subscribeToMessages(room.id);

	const {
		state: participationsState,
		participationMap,
		unsubscribe: unsubscribeParticipations,
	} = subscribeToParticipations(room.id);

	onDestroy(() => {
		unsubscribeMessages();
		unsubscribeParticipations();
	});

	async function onSubmit() {
		if (!ready || submitting) {
			return;
		}
		submitting = true;
		await sendTextMessage({ room_id: room.id, message });
		message = '';
		submitting = false;
	}

	$: ready = $roomState === 'subscribed' && $participationsState === 'subscribed';
</script>

<p>{room.title}</p>

{#each $messages as message (message.id)}
	{#if $participationMap[message.user_id]}
		<MessageComp {message} participation={$participationMap[message.user_id]} />
	{/if}
{/each}

<form on:submit|preventDefault={onSubmit}>
	<input bind:value={message} placeholder={t('placeholder')} disabled={!ready} />
</form>
