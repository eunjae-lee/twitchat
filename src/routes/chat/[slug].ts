import { withApiAuth } from '@supabase/auth-helpers-sveltekit';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals, params }) =>
	withApiAuth(
		{
			user: locals.user,
			redirectTo: `/sign_in?redirect_to=${encodeURIComponent(`/chat/${params.slug}`)}`,
		},
		async () => {
			return {
				status: 200,
			};
		}
	);
