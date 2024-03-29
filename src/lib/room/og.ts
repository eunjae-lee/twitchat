import { supabase } from '$lib/db';
import type { Lang, OpenGraphData, Room } from '$lib/types';
import { common } from '$lib/text/common';

export async function getOpenGraphData({ slug }: { slug?: string }): Promise<OpenGraphData> {
	if (!slug) {
		return {} as OpenGraphData;
	}
	const { data } = await supabase.from<Room>('rooms').select('*').eq('slug', slug);
	if (!data || !data[0]) {
		return {} as OpenGraphData;
	}

	const room = data[0];
	const lang = room.lang as Lang;
	const extraForOgImage = encodeURIComponent(
		JSON.stringify({
			lang,
			picture: room.picture,
			full_name: room.full_name,
			title: room.title,
		})
	);
	const image = `https://og.twit.chat/twitchat.png?theme=twitchat&extra=${extraForOgImage}`;
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
