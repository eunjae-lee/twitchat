const en = {
	emailMissing: 'Please setup email address\nin your Twitter account\nto use TwitChat',
	setup: 'Setup',
	why: 'Why?',
	whyDesc:
		'TwitChat uses an authentication solution named Supabase, and they do not support Twitter accounts missing email address.',
	seeMore: 'See more →',
	loading: 'Loading',
};

const ko: typeof en = {
	emailMissing: '트윗챗을 사용하기 위해서는\n트위터 계정에\n이메일을 세팅해주세요.',
	setup: '세팅하기',
	why: '왜?',
	whyDesc:
		'트윗챗에서는 Supabase라는 서비스를 통해 인증을 처리하고 있는데, Supabase에서는 이메일 주소를 등록하지 않은 트위터 계정을 처리하지 못하기 때문입니다.',
	seeMore: '더 읽어보기 →',
	loading: '로딩 중',
};

export const authenticated = {
	en,
	ko,
};
