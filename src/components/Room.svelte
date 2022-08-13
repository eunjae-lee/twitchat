<script lang="ts">
	import { getPreviousMessages, getRoom, sendTextMessage, supabase } from '$lib/db';
	import type { Message, Room } from '$lib/types';

	import { onDestroy, onMount } from 'svelte';

	export let slug: string;
	let room: Room;
	let message: string;
	let subscription: any;
	let messages: Message[] = [];

	onMount(async () => {
		room = (await getRoom({ slug }))!;
		getPreviousMessages({ room_id: room.id }).then((result) => {
			messages = result;
		});

		subscription = supabase
			// .from<Message>(`messages:room_id=eq.${room.id}`)
			.from<Message>(`messages`)
			.on('INSERT', (payload) => {
				messages = [...messages, payload.new];
			})
			.subscribe();
		console.log('# subscription', subscription);
	});

	onDestroy(() => {
		if (subscription) {
			supabase.removeSubscription(subscription);
			subscription = undefined;
		}
	});

	async function onSubmit() {
		await sendTextMessage({ room_id: room.id, message });
		message = '';
	}
</script>

<p>{room && room.title}</p>

{#each messages as message (message.id)}
	<div>{message.content}</div>
{/each}

<form on:submit|preventDefault={onSubmit}>
	<input bind:value={message} />
</form>
