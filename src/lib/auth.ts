import type { createRoom } from './db';

const KEY_PAYLOAD_ROOM = 'create_room_on_sign_in';
const KEY_REDIRECT_TO = 'redirect_to';

export function storePayloadToCreateRoomAfterSignIn({
	title,
}: Omit<Parameters<typeof createRoom>[0], 'user_id'>) {
	sessionStorage.setItem(KEY_PAYLOAD_ROOM, JSON.stringify({ title }));
}

export function popPayloadToCreateRoomAfterSignIn() {
	let json;
	try {
		const payload = sessionStorage.getItem(KEY_PAYLOAD_ROOM) as string;
		sessionStorage.removeItem(KEY_PAYLOAD_ROOM);
		json = JSON.parse(payload);
	} catch (_err) {
		// ignore this
	}

	if (!json) {
		return null;
	} else {
		return json as Omit<Parameters<typeof createRoom>[0], 'user_id'>;
	}
}

export function setRedirectionAfterSignIn(path: string) {
	sessionStorage.setItem(KEY_REDIRECT_TO, path);
}

export function peekRedirectionAfterSignIn() {
	const value = sessionStorage.getItem(KEY_REDIRECT_TO);
	return value;
}

export function popRedirectionAfterSignIn() {
	const value = sessionStorage.getItem(KEY_REDIRECT_TO);
	sessionStorage.removeItem(KEY_REDIRECT_TO);
	return value;
}
