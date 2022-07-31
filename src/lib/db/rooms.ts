import type { Room } from '$lib/types';
import { supabase, userId } from './client';

export async function createRoom({ title }: Pick<Room, 'title'>) {
	const { data } = await supabase.from<Room>('rooms').insert([
		{
			title,
			user_id: userId(),
		},
	]);
	if (data === null) {
		throw new Error('Failed to create a room');
	}
	return data[0];
}
