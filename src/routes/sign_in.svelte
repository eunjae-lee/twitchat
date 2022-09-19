<script context="module" lang="ts">
	import type { LoadEvent } from '@sveltejs/kit';
	import { getOpenGraphData } from '$lib/room';

	export async function load({ url }: LoadEvent) {
		const slug = url.searchParams.get('redirect_to')?.replace('/c/', '');
		return {
			props: {
				og: await getOpenGraphData({ slug }),
			},
		};
	}
</script>

<script lang="ts">
	import { setRedirectionAfterSignIn } from '$lib/auth';

	import { supabase } from '$lib/db';

	import { getter, signIn } from '$lib/text';
	import { onMount } from 'svelte';
	import type { OpenGraphData } from '$lib/types';
	const t = getter(signIn);

	export let og: OpenGraphData;
	let signingIn: boolean = false;

	async function signInWithTwitter() {
		signingIn = true;
		await supabase.auth.signIn(
			{
				provider: 'twitter',
			},
			{ redirectTo: window.location.origin + '/authenticated' }
		);
	}

	onMount(() => {
		const redirectTo = new URLSearchParams(window.location.search).get('redirect_to');
		if (redirectTo && redirectTo.startsWith('/')) {
			setRedirectionAfterSignIn(redirectTo);
		}
	});
</script>

<svelte:head>
	<title>{og.title}</title>
	<meta name="description" content={og.description} />
	<meta name="author" content={og.author} />

	<!-- Facebook Meta Tags -->
	<meta property="og:url" content={og.url} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={og.title} />
	<meta property="og:description" content={og.description} />
	<meta property="og:image" content={og.image} />

	<!-- Twitter Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={og.url} />
	<meta name="twitter:title" content={og.title} />
	<meta name="twitter:description" content={og.description} />
	<meta name="twitter:image" content={og.image} />
</svelte:head>

<div class="container mx-auto max-w-xs md:max-w-sm h-screen flex flex-col justify-center">
	<div class="card max-w-96 bg-base-100 shadow-xl">
		<div class="card-body">
			<div class="flex justify-center">
				<img class="w-8" src="/logo-big.png" alt="TwitChat Logo" />
			</div>
			<h2 class="mt-2 card-title text-2xl justify-center">
				<span>{t('h1')}</span>
			</h2>
			<div class="mt-16 card-actions">
				<button
					on:click={signInWithTwitter}
					class="btn btn-primary grow"
					class:loading={signingIn}
					disabled={signingIn}
					><svg
						version="1.1"
						xmlns="http://www.w3.org/2000/svg"
						xmlns:xlink="http://www.w3.org/1999/xlink"
						viewBox="0 0 400 400"
						style="enable-background:new 0 0 400 400;"
						xml:space="preserve"
						class="w-6"
					>
						<style type="text/css">
							.st0 {
								fill: #ffffff;
							}
						</style>
						<path
							class="st0"
							d="M400,200c0,110.5-89.5,200-200,200S0,310.5,0,200S89.5,0,200,0S400,89.5,400,200z M163.4,305.5
		c88.7,0,137.2-73.5,137.2-137.2c0-2.1,0-4.2-0.1-6.2c9.4-6.8,17.6-15.3,24.1-25c-8.6,3.8-17.9,6.4-27.7,7.6
		c10-6,17.6-15.4,21.2-26.7c-9.3,5.5-19.6,9.5-30.6,11.7c-8.8-9.4-21.3-15.2-35.2-15.2c-26.6,0-48.2,21.6-48.2,48.2
		c0,3.8,0.4,7.5,1.3,11c-40.1-2-75.6-21.2-99.4-50.4c-4.1,7.1-6.5,15.4-6.5,24.2c0,16.7,8.5,31.5,21.5,40.1c-7.9-0.2-15.3-2.4-21.8-6
		c0,0.2,0,0.4,0,0.6c0,23.4,16.6,42.8,38.7,47.3c-4,1.1-8.3,1.7-12.7,1.7c-3.1,0-6.1-0.3-9.1-0.9c6.1,19.2,23.9,33.1,45,33.5
		c-16.5,12.9-37.3,20.6-59.9,20.6c-3.9,0-7.7-0.2-11.5-0.7C110.8,297.5,136.2,305.5,163.4,305.5"
						/>
					</svg>

					<span class="ml-2">{t('signIn')}</span></button
				>
			</div>
		</div>
	</div>
</div>
