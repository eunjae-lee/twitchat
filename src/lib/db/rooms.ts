import type { CheckParticipation, Room } from '$lib/types';
import { supabase } from './client';

export async function createRoom({ title, user_id }: Pick<Room, 'title' | 'user_id'>) {
	const { data, error } = await supabase.from<Room>('rooms').insert([
		{
			title,
			user_id,
		},
	]);
	if (data === null) {
		throw error;
	}
	return data[0];
}

export async function isParticipating({
	slug,
	user_id,
}: {
	slug: string;
	user_id: string;
}): Promise<boolean> {
	try {
		const { data } = await supabase
			.from<CheckParticipation>('check_participation')
			.select('role')
			.eq('slug', slug)
			.eq('user_id', user_id);
		const role = data?.[0]?.role;
		return role === 'admin' || role === 'user';
	} catch (_err) {
		return false;
	}
}

export async function participate({ slug }: { slug: string }): Promise<void> {
	await supabase.rpc('participate_room', { param_slug: slug });
}
