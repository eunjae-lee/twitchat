import type { HandleError, GetSession, Handle, RequestEvent } from '@sveltejs/kit';
import { handleAuth } from '@supabase/auth-helpers-sveltekit';
import { sequence } from '@sveltejs/kit/hooks';

import * as Sentry from '@sentry/node';
import '@sentry/tracing';

Sentry.init({
	dsn: 'https://f86c9a88f7de4626aa0f5f9295c10417@o401874.ingest.sentry.io/6591315',

	// Set tracesSampleRate to 1.0 to capture 100%
	// of transactions for performance monitoring.
	// We recommend adjusting this value in production
	tracesSampleRate: 1.0,
});

export async function handleError({ error }: Parameters<HandleError>[0]) {
	Sentry.captureException(error);
}

export const handle: Handle = sequence(
	...handleAuth({
		logout: { returnTo: '/auth/signin' },
	})
);

export const getSession: GetSession = async (event: RequestEvent) => {
	const { user, accessToken, error } = event.locals;
	return {
		user,
		accessToken,
		error,
	};
};
