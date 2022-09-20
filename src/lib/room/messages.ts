import { getPreviousMessages, supabase } from '$lib/db';
import type { Message } from '$lib/types';
import type { RealtimeSubscription } from '@supabase/realtime-js';
import { writable } from 'svelte/store';

export function subscribeToMessages({
	roomId,
	onMessagesLoadedInitially,
	onNewMessage,
}: {
	roomId: string;
	onMessagesLoadedInitially: () => void;
	onNewMessage: (message: Message) => void;
}) {
	const messages = writable<Message[]>([]);
	const state = writable<'init' | 'subscribed'>('init');

	let subscription: RealtimeSubscription | undefined = supabase
		.from<Message>(`messages:room_id=eq.${roomId}`)
		.on('INSERT', (payload) => {
			messages.update((array) => {
				array.push(payload.new);
				return array;
			});
			onNewMessage(payload.new);
		})
		.subscribe((event: string) => {
			if (event === 'SUBSCRIBED') {
				state.set('subscribed');
			}
		});

	async function loadPreviousMessagesAndMerge() {
		const result = await getPreviousMessages({ room_id: roomId });
		messages.update((array) => {
			const ids = new Set<string>();
			return (
				[...array, ...result]
					// remove possibly duplicated items
					.filter((item) => {
						if (ids.has(item.id)) {
							return false;
						}
						ids.add(item.id);
						return true;
					})
					// `array` could be filled with items via the realtime subscription
					// even before the fetch was successful.
					// So, we're sorting them by date.
					.sort((a, b) => new Date(a.created_ts).getTime() - new Date(b.created_ts).getTime())
			);
		});
	}

	loadPreviousMessagesAndMerge().then(() => {
		onMessagesLoadedInitially();
	});

	function unsubscribe() {
		if (subscription) {
			supabase.removeSubscription(subscription);
			subscription = undefined;
		}
	}

	function refreshMessages() {
		return loadPreviousMessagesAndMerge();
	}

	return { state, messages, unsubscribe, refreshMessages };
}
