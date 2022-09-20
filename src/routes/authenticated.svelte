<script lang="ts">
	import { goto } from '$app/navigation';
	import { session } from '$app/stores';
	import { popRedirectionAfterSignIn } from '$lib/auth';
	import { onMount } from 'svelte';
	import { getter, authenticated } from '$lib/text';
	import * as Sentry from '@sentry/browser';
	const t = getter(authenticated);

	let state: 'loading' | 'missing_email' = 'loading';
	let showingWhy: boolean = false;

	const hash = typeof window !== 'undefined' && window.location.hash;
	if (!(hash || '').startsWith('#access_token')) {
		Sentry.captureException('hash does not include access token', {
			extra: {
				hash,
				session: $session,
			},
		});
	}

	$: {
		const sessionExists = $session.user && $session.user.id;

		if (sessionExists) {
			const redirectTo = popRedirectionAfterSignIn();
			if (redirectTo && redirectTo.startsWith('/')) {
				goto(redirectTo);
			}
		}
	}

	onMount(() => {
		const params = new URLSearchParams(window.location.href.split('?')[1]);
		if (
			params.get('error') === 'server_error' &&
			params.get('error_description') === 'Error getting user email from external provider'
		) {
			state = 'missing_email';
		}
	});
</script>

{#if state === 'loading'}
	<div class="w-screen h-screen flex items-center justify-center">
		<svg
			class="animate-spin h-8 w-8"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
		>
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
			<path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			/>
		</svg>
		<span class="sr-only">{t('loading')}</span>
	</div>
{:else if state === 'missing_email'}
	<div class="container max-w-md mx-auto flex flex-col items-center">
		<div class="mt-16">
			<img src="/logo.png" alt="TwitChat logo" class="w-12" />
		</div>
		<div class="mt-4 px-4">
			<p class="mt-2 text-warning opacity-75 font-bold text-center">Failed to login</p>
			{#each t('emailMissing').split('\n') as text}
				<p class="font-bold text-2xl text-center">{text}</p>
			{/each}
		</div>
		<a href="https://twitter.com/settings/email" target="_blank" class="mt-12 btn btn-primary"
			>{t('setup')}</a
		>
		<button
			type="button"
			class="mt-1 btn btn-ghost text-gray-600"
			on:click={() => {
				showingWhy = true;
			}}>{t('why')}</button
		>
		{#if showingWhy}
			<p class="px-12">
				{t('whyDesc')}
				<a
					class="text-info opacity-50 hover:opacity-75"
					href="https://github.com/supabase/gotrue/issues/214"
					target="_blank">{t('seeMore')}</a
				>
			</p>
		{/if}
	</div>
{/if}
