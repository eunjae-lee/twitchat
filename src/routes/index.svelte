<script lang="ts">
	import { session } from '$app/stores';
	import { getter, landing, getSiteTitle, getSiteDescription } from '$lib/text';
	const t = getter(landing);

	const title = getSiteTitle();
	const desc = getSiteDescription();
	const url = 'https://twit.chat';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={desc} />
	<!-- <meta name="author" content={og.author} /> -->

	<!-- Facebook Meta Tags -->
	<meta property="og:url" content={url} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={desc} />
	<!-- <meta property="og:image" content={og.image} /> -->

	<!-- Twitter Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={url} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={desc} />
	<!-- <meta name="twitter:image" content={og.image} /> -->
</svelte:head>

<div class="container max-w-md mx-auto flex flex-col items-center">
	<div class="mt-16">
		<img src="/logo.png" alt="TwitChat logo" class="w-12" />
	</div>
	<h1 class="mt-2">{getSiteTitle()}</h1>
	<div class="mt-8 text-3xl text-center flex flex-col gap-1">
		{#if $session.lang === 'en'}
			<p class="font-extrabold">
				<span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-600"
					>Realtime</span
				> chat with
			</p>
			<p class="font-extrabold">
				your <span
					class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600"
					>Twitter</span
				> friends
			</p>
		{:else if $session.lang === 'ko'}
			<p class="font-bold">
				<span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600"
					>트친</span
				>과 함께 하는
			</p>
			<p class="font-bold">
				<span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-600"
					>실시간</span
				> 채팅
			</p>
		{/if}
	</div>
	<div class="mt-28 flex flex-col items-center">
		<a sveltekit:prefetch href="/new" class="narrow-container btn btn-primary text-lg"
			>{t('newChat')}</a
		>
		<p class="mt-2 opacity-75 text-sm">{t('subMessage')}</p>
	</div>

	<div class="fixed bottom-0 py-8">
		<a
			href="https://twitter.com/twitchat_app"
			target="_blank"
			class="text-gray-400 hover:text-gray-500"
		>
			<span class="sr-only">Twitter</span>
			<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
				<path
					d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
				/>
			</svg>
		</a>
	</div>
</div>
