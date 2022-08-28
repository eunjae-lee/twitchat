<script lang="ts">
	import { getter, landing, getSiteTitle } from '$lib/text';
	import { getContext } from 'svelte';
	const t = getter(landing);
	const lang = getContext('lang');
</script>

<div class="container max-w-md mx-auto flex flex-col items-center">
	<div class="mt-16">
		<img src="/logo.png" alt="TwitChat logo" class="w-12" />
	</div>
	<h1 class="mt-2">{getSiteTitle()}</h1>
	<div class="mt-8 text-3xl text-center flex flex-col gap-1">
		{#if lang === 'en'}
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
		{:else if lang === 'ko'}
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
	<div class="mt-12 w-full px-4 flex flex-col items-center">
		<a sveltekit:prefetch href="/new" class="w-full sm:w-64 btn btn-primary text-lg"
			>{t('newChat')}</a
		>
		<p class="mt-1 opacity-75 text-sm">{t('subMessage')}</p>
	</div>

	<div class="mt-32 fixed bottom-0 py-8">
		<a
			class="text-xs opacity-10 hover:opacity-50"
			href="https://twitter.com/twitchat_app"
			target="_blank"
		>
			<svg
				class="w-8"
				version="1.1"
				id="Layer_1"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				x="0px"
				y="0px"
				viewBox="0 0 400 400"
				style="enable-background:new 0 0 400 400;"
				xml:space="preserve"
			>
				<style type="text/css">
					.st0 {
						fill: #1b9df0;
					}
					.st1 {
						fill: #ffffff;
					}
				</style>
				<g id="Dark_Blue">
					<circle class="st0" cx="200" cy="200" r="200" />
				</g>
				<g id="Logo__x2014__FIXED">
					<path
						class="st1"
						d="M163.4,305.5c88.7,0,137.2-73.5,137.2-137.2c0-2.1,0-4.2-0.1-6.2c9.4-6.8,17.6-15.3,24.1-25
					c-8.6,3.8-17.9,6.4-27.7,7.6c10-6,17.6-15.4,21.2-26.7c-9.3,5.5-19.6,9.5-30.6,11.7c-8.8-9.4-21.3-15.2-35.2-15.2
					c-26.6,0-48.2,21.6-48.2,48.2c0,3.8,0.4,7.5,1.3,11c-40.1-2-75.6-21.2-99.4-50.4c-4.1,7.1-6.5,15.4-6.5,24.2
					c0,16.7,8.5,31.5,21.5,40.1c-7.9-0.2-15.3-2.4-21.8-6c0,0.2,0,0.4,0,0.6c0,23.4,16.6,42.8,38.7,47.3c-4,1.1-8.3,1.7-12.7,1.7
					c-3.1,0-6.1-0.3-9.1-0.9c6.1,19.2,23.9,33.1,45,33.5c-16.5,12.9-37.3,20.6-59.9,20.6c-3.9,0-7.7-0.2-11.5-0.7
					C110.8,297.5,136.2,305.5,163.4,305.5"
					/>
				</g>
			</svg>
		</a>
	</div>
</div>
