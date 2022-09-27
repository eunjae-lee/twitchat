import type { Message } from '$lib/types';
import { supabase } from './client';

export async function sendTextMessage({ room_id, message }: { room_id: string; message: string }) {
	await supabase.from<Message>('messages').insert([
		{
			room_id,
			content: message,
			type: 'text',
		},
	]);
}

export async function sendEmojiMessage({ room_id, emoji }: { room_id: string; emoji: string }) {
	await supabase.from<Message>('messages').insert([
		{
			room_id,
			content: emoji,
			type: 'emoji',
		},
	]);
}

export async function getPreviousMessages({ room_id }: { room_id: string }): Promise<Message[]> {
	const { data } = await supabase.from<Message>('messages').select('*').eq('room_id', room_id);
	return data || [];
}
