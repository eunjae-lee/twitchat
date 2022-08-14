import type { Participation } from '$lib/types';
import { supabase } from './client';

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

export async function getParticipations({ roomId }: { roomId: string }): Promise<Participation[]> {
	const { data } = await supabase
		.from<Participation>('participations')
		.select('*')
		.eq('room_id', roomId);
	return data || [];
}
