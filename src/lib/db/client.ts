// src/lib/db.ts
import { createSupabaseClient } from '@supabase/auth-helpers-sveltekit';

const result = createSupabaseClient(
	import.meta.env.VITE_SUPABASE_URL as string,
	import.meta.env.VITE_SUPABASE_ANON_KEY as string
);

// result.supabaseClient is undefined only when the two parameters are not given above.
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const supabase = result.supabaseClient!;

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const isSignedIn = () => Boolean(supabase.auth.user() && supabase.auth.user()!.id);

const userId = () => {
	if (!supabase.auth.user()?.id) {
		throw new Error('The user is not authenticated');
	}

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return supabase.auth.user()!.id;
};

export { supabase, isSignedIn, userId };
