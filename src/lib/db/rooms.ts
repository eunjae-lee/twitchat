import type { Room } from '$lib/types';
import { supabase } from './client';

export async function createRoom({ title, lang }: Pick<Room, 'title' | 'lang'>) {
	const { data, error } = await supabase.from<Room>('rooms').insert([
		{
			title,
			lang,
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

export async function renameRoom({ roomId, title }: { roomId: string; title: string }) {
	return await supabase.from<Room>('rooms').update({ title }).eq('id', roomId);
}
