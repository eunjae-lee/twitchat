import type { Room } from '$lib/types';
import { supabase } from './client';

export async function createRoom({ title }: Pick<Room, 'title'>) {
	// TODO: use `supabase.auth.user().id` below
	const { data } = await supabase.from<Room>('rooms').insert([
		{
			title,
		},
	]);
	if (data === null) {
		throw new Error('Failed to create a room');
	}
	return data[0];
}
