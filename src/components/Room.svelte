<script lang="ts">
	import type { ChatItem, Room } from '$lib/types';
	import { getter, room as roomTexts } from '$lib/text';
	import { subscribeToMessages, subscribeToParticipations } from '$lib/room';
	import { afterUpdate, onDestroy } from 'svelte';
	import { session } from '$app/stores';
	import MessageView from './message/View.svelte';
	import MessageComposer from './message/Composer.svelte';
	import ParticipationView from './ParticipationView.svelte';
	import CountDown from './CountDown.svelte';
	import { renameRoom } from '$lib/db';

	export let room: Room;

	const t = getter(roomTexts);

	let state: 'init' | 'active' | 'closed' = 'init';
	let messageContainer: HTMLDivElement;
	let chatItems: ChatItem[] = [];
	let scrollToBottomAfterRendering: boolean;

	function isScrollAlmostAtBottom() {
		return (
			Math.abs(
				messageContainer.scrollTop + messageContainer.clientHeight - messageContainer.scrollHeight
			) < 25
		);
	}

	const {
		state: roomState,
		messages,
		unsubscribe: unsubscribeMessages,
	} = subscribeToMessages({
		roomId: room.id,
		onMessagesLoadedInitially: () => {
			scrollToBottomAfterRendering = true;
		},
		onNewMessage: () => {
			scrollToBottomAfterRendering = isScrollAlmostAtBottom();
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

	afterUpdate(() => {
		if (scrollToBottomAfterRendering) {
			messageContainer.scrollTop = messageContainer.scrollHeight;
			scrollToBottomAfterRendering = false;
		}
	});

	$: {
		if ($roomState === 'subscribed' && $participationsState === 'subscribed') {
			state = 'active';
		}
	}

	// merge messages and participations
	$: chatItems = [
		...$messages.map(
			(message) =>
				({
					id: message.id,
					type: 'm',
					created_ts: message.created_ts,
					message,
				} as ChatItem)
		),
		...Object.values($participationMap).map(
			(participation) =>
				({
					id: participation.id,
					type: 'p',
					created_ts: participation.created_ts,
					participation,
				} as ChatItem)
		),
	].sort((a, b) => new Date(a.created_ts).getTime() - new Date(b.created_ts).getTime());
</script>

<div class="navbar bg-base-100">
	<div class="flex-none">
		<img src="/logo.png" alt="TwitChat logo" class="ml-2 w-8" />
	</div>
	<div class="flex-1">
		<p class="ml-2 text-xl">{room.title}</p>
	</div>
	<div class="flex-none">
		<div class="absolute top-4 right-4">
			<CountDown
				end_ts={room.end_ts}
				onClosed={() => {
					state = 'closed';
				}}
			/>
		</div>

		<div class="dropdown dropdown-end">
			<label for="menu" tabindex="0" class="btn btn-square btn-ghost m-1"
				><svg fill="none" viewBox="0 0 24 24" class="inline-block w-5 h-5 stroke-current"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h16"
					/></svg
				></label
			>
			<ul
				id="menu"
				tabindex="0"
				class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52"
			>
				<li class="uppercase text-xs px-4 py-4 font-extrabold">{t('admin')}</li>
				<li>
					<button
						type="button"
						on:click={async () => {
							const newTitle = prompt(t('renameTitle'), room.title);
							if (newTitle !== null) {
								const { data, error } = await renameRoom({ roomId: room.id, title: newTitle });
								if (!error) {
									room = data[0];
								}
							}
						}}>{t('renameTitle')}</button
					>
				</li>
			</ul>
		</div>
	</div>
</div>

<div
	bind:this={messageContainer}
	class="overflow-y-auto flex flex-col gap-4 px-4 relative"
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

<MessageComposer active={state === 'active'} {room} />
