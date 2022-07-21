<script>
	import * as Sentry from '@sentry/browser';
	import { BrowserTracing } from '@sentry/tracing';
	import { session } from '$app/stores';
	import { supabaseClient } from '$lib/db';
	import { SupaAuthHelper } from '@supabase/auth-helpers-svelte';

	import '../app.css';

	Sentry.init({
		dsn: 'https://f86c9a88f7de4626aa0f5f9295c10417@o401874.ingest.sentry.io/6591315',
		integrations: [new BrowserTracing()],

		// Set tracesSampleRate to 1.0 to capture 100%
		// of transactions for performance monitoring.
		// We recommend adjusting this value in production
		tracesSampleRate: 1.0,
	});
</script>

<SupaAuthHelper {supabaseClient} {session}>
	<slot />
</SupaAuthHelper>
