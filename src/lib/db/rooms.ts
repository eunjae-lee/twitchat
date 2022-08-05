import type { Room } from '$lib/types';
import { supabase } from './client';

export async function createRoom({ title, user_id }: Pick<Room, 'title' | 'user_id'>) {
	const { data } = await supabase.from<Room>('rooms').insert([
		{
			title,
			user_id,
		},
	]);
	if (data === null) {
		throw new Error('Failed to create a room');
	}
	return data[0];
}
