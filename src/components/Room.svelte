<script lang="ts">
	import {
		getParticipations,
		getPreviousMessages,
		getRoom,
		sendTextMessage,
		supabase,
	} from '$lib/db';
	import type { Message, Participation, Room } from '$lib/types';
	import { getter, room as roomTexts } from '$lib/text';
	import { onDestroy, onMount } from 'svelte';
	import MessageComp from './Message.svelte';

	export let slug: string;
	let room: Room;
	let message: string;
	let messageSubscription: any;
	let messages: Message[] = [];
	let participationMap: Record<string, Participation> = {};
	let participationSubscription: any;
	const t = getter(roomTexts);

	onMount(async () => {
		room = (await getRoom({ slug }))!;

		getParticipations({ roomId: room.id }).then((result) => {
			result.forEach((participation) => {
				participationMap[participation.user_id] = participation;
			});
			participationMap = participationMap;
		});

		getPreviousMessages({ room_id: room.id }).then((result) => {
			messages = result;
		});

		messageSubscription = supabase
			.from<Message>(`messages:room_id=eq.${room.id}`)
			.on('INSERT', (payload) => {
				messages.push(payload.new);
				messages = messages;
			})
			.subscribe();

		participationSubscription = supabase
			.from<Participation>(`participations:room_id.eq.${room.id}`)
			.on('INSERT', (payload) => {
				participationMap[payload.new.user_id] = payload.new;
				participationMap = participationMap;
			})
			.subscribe();
	});

	onDestroy(() => {
		if (messageSubscription) {
			supabase.removeSubscription(messageSubscription);
			messageSubscription = undefined;
		}
		if (participationSubscription) {
			supabase.removeSubscription(participationSubscription);
			participationSubscription = undefined;
		}
	});

	async function onSubmit() {
		await sendTextMessage({ room_id: room.id, message });
		message = '';
	}
</script>

<p>{room && room.title}</p>

{#each messages as message (message.id)}
	{#if participationMap[message.user_id]}
		<MessageComp {message} participation={participationMap[message.user_id]} />
	{/if}
{/each}

<form on:submit|preventDefault={onSubmit}>
	<input bind:value={message} placeholder={t('placeholder')} />
</form>
