<script lang="ts">
	import debounce from 'just-debounce';
	import type { ChatItem, Room } from '$lib/types';
	import { getter, room as roomTexts } from '$lib/text';
	import { subscribeToMessages, subscribeToParticipations } from '$lib/room';
	import { afterUpdate, onDestroy, onMount } from 'svelte';
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
	let showGoToBottomButton: number = 0;
	let localTempMessages: ChatItem[] = [];

	function isScrollAlmostAtBottom() {
		return (
			Math.abs(
				messageContainer.scrollTop + messageContainer.clientHeight - messageContainer.scrollHeight
			) < 25
		);
	}

	function onSendingNewMessage({ content, type }: { content: string; type: string }) {
		scrollToBottomAfterRendering = isScrollAlmostAtBottom();
		if (!scrollToBottomAfterRendering) {
			showGoToBottomButton += 1;
		}

		localTempMessages.push({
			id: String(new Date().getTime()),
			type: 'm',
			created_ts: new Date().toISOString(),
			message: {
				id: `temp_${new Date().getTime()}`,
				room_id: room.id,
				user_id: $session.user.id,
				created_ts: new Date().toISOString(),
				content,
				type,
			},
		} as ChatItem);

		localTempMessages = localTempMessages;
		// setTimeout(() => {
		// 	// The first message sent right after joining the room is
		// 	// sometimes not retrieved via realtime API :shrug:
		// 	// So, let's pull the messages whenever it happens as a workaround.
		// 	if (localTempMessages.length > 0) {
		// 		refreshMessages();
		// 	}
		// }, 2000);
	}

	const {
		state: roomState,
		messages,
		unsubscribe: unsubscribeMessages,
		refreshMessages,
	} = subscribeToMessages({
		roomId: room.id,
		onMessagesLoadedInitially: () => {
			scrollToBottomAfterRendering = true;
		},
		onNewMessage: (message) => {
			localTempMessages = localTempMessages.filter((localMessage) => {
				if (
					localMessage.type === 'm' &&
					localMessage.message.type === message.type &&
					localMessage.message.content === message.content
				) {
					return false;
				}
				return true;
			});
		},
	});

	const {
		state: participationsState,
		participationMap,
		participationList,
		unsubscribe: unsubscribeParticipations,
	} = subscribeToParticipations(room.id);

	onDestroy(() => {
		unsubscribeMessages();
		unsubscribeParticipations();
	});

	afterUpdate(() => {
		if (scrollToBottomAfterRendering) {
			setTimeout(() => {
				messageContainer.scrollTop = messageContainer.scrollHeight;
				scrollToBottomAfterRendering = false;
			}, 20);
		}
	});

	$: {
		if ($roomState === 'subscribed' && $participationsState === 'subscribed') {
			state = 'active';
		}
	}

	// merge messages and participations
	$: chatItems = [
		...localTempMessages,
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

<div class="flex flex-col absolute inset-0">
	<div class="grow-0 shrink-0 navbar bg-base-100">
		<div class="flex-none">
			<img src="/logo.png" alt="TwitChat logo" class="ml-2 w-8" />
		</div>
		<div class="flex-1">
			<p class="ml-3 text-xl keep-all" title={room.title}>{room.title}</p>
		</div>
		<div class="flex-none">
			<CountDown
				end_ts={room.end_ts}
				onClosed={() => {
					state = 'closed';
				}}
			/>

			<div class="dropdown dropdown-end">
				<label for="menu" tabindex="0" class="btn btn-square btn-ghost m-1"
					><svg fill="none" viewBox="0 0 24 24" class="inline-block w-5 h-5 stroke-current"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/></svg
					><span class="sr-only">{t('menu')}</span>
				</label>
				<ul
					id="menu"
					tabindex="0"
					class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52"
				>
					{#if room.user_id === $session.user.id}
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
						<li class="border-b border-base-content" />
					{/if}
					<li>
						<label for="modal-participants" class="modal-button"
							><span>{t('participants')}</span><span class="text-xs"
								>({$participationList.length})</span
							></label
						>
					</li>
				</ul>
			</div>
		</div>
	</div>

	<div bind:this={messageContainer} class="grow overflow-y-auto flex flex-col gap-4 px-4 relative">
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

	<div class="grow-0 shrink-0 relative">
		{#if showGoToBottomButton > 0}
			<div class="absolute w-full -top-12 flex justify-center">
				<button
					class="btn btn-ghost bg-base-100 opacity-75"
					on:click={() => {
						messageContainer.scrollTop = messageContainer.scrollHeight;
						showGoToBottomButton = 0;
					}}
				>
					<svg
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-4 h-4 mr-1"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75"
						/>
					</svg>
					{t('gotoBottom')} <span class="ml-1 text-xs">({showGoToBottomButton})</span></button
				>
			</div>
		{/if}
		<MessageComposer active={state === 'active'} {room} onNewMessage={onSendingNewMessage} />
	</div>
</div>

<input type="checkbox" id="modal-participants" class="modal-toggle" />
<label for="modal-participants" class="modal modal-bottom sm:modal-middle cursor-pointer">
	<label class="modal-box" for="">
		<h3 class="font-bold text-lg">{t('participants')}</h3>
		<ul class="mt-8 flex flex-col gap-4">
			{#each $participationList as participation (participation.id)}
				<li>
					<a
						class="flex items-center gap-2"
						href={`https://twitter.com/${participation.user_name}`}
						target="_blank"
						><img
							class="shrink-0 rounded-full w-8 h-8"
							src={participation.picture}
							alt={`Profile picture of ${participation.full_name}`}
						/>
						<span>{participation.full_name}</span>
					</a>
				</li>
			{/each}
		</ul>
	</label>
</label>

<style>
	.keep-all {
		word-break: keep-all;
	}
</style>
