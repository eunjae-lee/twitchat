<script lang="ts">
	import type { ChatItem, Room } from '$lib/types';
	import { getter, room as roomTexts } from '$lib/text';
	import { subscribeToMessages, subscribeToParticipations } from '$lib/room';
	import { onDestroy } from 'svelte';
	import { session } from '$app/stores';
	import MessageView from './message/View.svelte';
	import MessageComposer from './message/Composer.svelte';
	import ParticipationView from './ParticipationView.svelte';

	export let room: Room;

	const t = getter(roomTexts);

	let ready: boolean = false;
	let messageContainer: HTMLDivElement;
	let chatItems: ChatItem[] = [];

	const {
		state: roomState,
		messages,
		unsubscribe: unsubscribeMessages,
	} = subscribeToMessages({
		roomId: room.id,
		onMessagesLoadedInitially: () => {
			setTimeout(() => {
				messageContainer.scrollTop = messageContainer.scrollHeight;
			}, 100);
		},
		onNewMessage: () => {
			setTimeout(() => {
				messageContainer.scrollTop = messageContainer.scrollHeight;
			}, 100);
		},
	});

	const {
		state: participationsState,
		participationMap,
		unsubscribe: unsubscribeParticipations,
	} = subscribeToParticipations(room.id);

	onDestroy(() => {
		unsubscribeMessages();
		unsubscribeParticipations();
	});

	$: ready = $roomState === 'subscribed' && $participationsState === 'subscribed';

	// merge messages and participations
	$: chatItems = [
		...$messages.map((message) => ({
			id: message.id,
			type: 'm',
			created_ts: message.created_ts,
			message,
		})),
		...Object.values($participationMap).map((participation) => ({
			id: participation.id,
			type: 'p',
			created_ts: participation.created_ts,
			participation,
		})),
	].sort((a, b) => new Date(a.created_ts).getTime() - new Date(b.created_ts).getTime());
</script>

<div class="navbar bg-base-100">
	<div class="flex-none">
		<img src="/logo.png" alt="TwitChat logo" class="ml-2 w-8" />
	</div>
	<div class="flex-1">
		<p class="ml-2 text-xl">{room.title}</p>
	</div>
	<!-- <div class="flex-none">
		<button class="btn btn-square btn-ghost">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				class="inline-block w-5 h-5 stroke-current"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 6h16M4 12h16M4 18h16"
				/></svg
			>
		</button>
	</div> -->
</div>

<div
	bind:this={messageContainer}
	class="overflow-y-auto flex flex-col gap-4 px-4"
	style:height="calc(100vh - 9rem)"
>
	{#each chatItems as chatItem (`${chatItem.type}-${chatItem.id}`)}
		{#if chatItem.type === 'm' && $participationMap[chatItem.message.user_id]}
			<MessageView
				isMine={$session.user.id === chatItem.message.user_id}
				message={chatItem.message}
				participation={$participationMap[chatItem.message.user_id]}
			/>
		{/if}
		{#if chatItem.type === 'p'}
			<ParticipationView participation={chatItem.participation} />
		{/if}
	{/each}
</div>

<MessageComposer {ready} {room} />
