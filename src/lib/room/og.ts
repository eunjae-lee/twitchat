import { supabase } from '$lib/db';
import type { OpenGraphData, Room } from '$lib/types';
import { common } from '$lib/text/common';

export async function getOpenGraphData({
	slug,
	lang,
}: {
	slug?: string;
	lang: 'ko' | 'en';
}): Promise<OpenGraphData> {
	if (!slug) {
		return {} as OpenGraphData;
	}
	const { data } = await supabase.from<Room>('rooms').select('*').eq('slug', slug);
	if (!data || !data[0]) {
		return {} as OpenGraphData;
	}

	const room = data[0];
	const extraForOgImage = encodeURIComponent(
		JSON.stringify({
			lang,
			picture: room.picture,
			full_name: room.full_name,
			title: room.title,
		})
	);
	const image = `https://og-image.eunjae.dev/twitchat.png?theme=twitchat&extra=${extraForOgImage}`;
	const title = `${room.title} | ${common[lang].title}`;
	const author = `${room.full_name} (@${room.user_name})`;
	const url = `https://twit.chat/c/${slug}`;
	const description = common[lang].metaDescription;

	return {
		title,
		author,
		description,
		url,
		image,
	};
}
