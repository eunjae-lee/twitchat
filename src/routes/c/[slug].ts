import { withApiAuth } from '@supabase/auth-helpers-sveltekit';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals, params }) => {
	return withApiAuth(
		{
			user: locals.user,
			redirectTo: `/sign_in?redirect_to=${encodeURIComponent(`/c/${params.slug}`)}`,
		},
		async () => {
			return {
				status: 200,
			};
		}
	);
};
