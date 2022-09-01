<script context="module" lang="ts">
	import type { LoadEvent } from '@sveltejs/kit';

	export function load({ session }: LoadEvent) {
		return {
			props: {
				lang: session.lang,
			},
		};
	}
</script>

<script lang="ts">
	import * as Sentry from '@sentry/browser';
	import { BrowserTracing } from '@sentry/tracing';
	import { session } from '$app/stores';
	import { supabase } from '$lib/db';
	import type { Lang } from '$lib/types';
	import { SupaAuthHelper } from '@supabase/auth-helpers-svelte';
	import { setContext } from 'svelte';
	import { getSiteTitle } from '$lib/text';

	import '../app.css';

	export let lang: Lang;
	setContext('lang', lang);

	Sentry.init({
		dsn: 'https://f86c9a88f7de4626aa0f5f9295c10417@o401874.ingest.sentry.io/6591315',
		integrations: [new BrowserTracing()],

		// Set tracesSampleRate to 1.0 to capture 100%
		// of transactions for performance monitoring.
		// We recommend adjusting this value in production
		tracesSampleRate: 1.0,
	});
</script>

<svelte:head>
	<title>{getSiteTitle()}</title>
</svelte:head>

<SupaAuthHelper supabaseClient={supabase} {session}>
	<slot />
</SupaAuthHelper>

<style>
	:global(.narrow-container) {
		@apply w-[18rem];
	}
</style>
