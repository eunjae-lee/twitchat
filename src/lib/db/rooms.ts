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

export async function isParticipating({
	slug,
	user_id,
}: {
	slug: string;
	user_id: string;
}): Promise<boolean> {
	const { data } = await supabase
		.from('participations_with_slug')
		.select('room_id')
		.eq('slug', slug)
		.eq('user_id', user_id);
	return Boolean(data && data[0]);
}

export async function participate({ slug }: { slug: string }): Promise<void> {
	await supabase.rpc('participate_room', { param_slug: slug });
}
