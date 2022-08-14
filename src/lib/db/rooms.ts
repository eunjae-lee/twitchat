import type { Room } from '$lib/types';
import { supabase } from './client';

export async function createRoom({ title }: Pick<Room, 'title'>) {
	const { data, error } = await supabase.from<Room>('rooms').insert([
		{
			title,
		},
	]);
	if (data === null) {
		throw error;
	}
	return data[0];
}

export async function getRoom({ slug }: { slug: string }) {
	const { data } = await supabase.from<Room>('rooms').select('*').eq('slug', slug);
	return data?.[0];
}
