import { getParticipations, supabase } from '$lib/db';
import type { Participation } from '$lib/types';
import type { RealtimeSubscription } from '@supabase/realtime-js';
import { writable } from 'svelte/store';

export function subscribeToParticipations(roomId: string) {
	const participationMap = writable<Record<string, Participation>>({});
	const state = writable<'init' | 'subscribed'>('init');

	let subscription: RealtimeSubscription | undefined = supabase
		.from<Participation>(`participations:room_id=eq.${roomId}`)
		.on('INSERT', (payload) => {
			participationMap.update((map) => {
				map[payload.new.user_id] = payload.new;
				return map;
			});
		})
		.subscribe((event: string) => {
			if (event === 'SUBSCRIBED') {
				state.set('subscribed');
			}
		});

	getParticipations({ roomId }).then((result) => {
		result.forEach((participation) => {
			participationMap.update((map) => {
				map[participation.user_id] = participation;
				return map;
			});
		});
	});

	function unsubscribe() {
		if (subscription) {
			supabase.removeSubscription(subscription);
			subscription = undefined;
		}
	}

	return { state, participationMap, unsubscribe };
}
