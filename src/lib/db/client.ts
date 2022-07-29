// src/lib/db.ts
import { createSupabaseClient } from '@supabase/auth-helpers-sveltekit';

const result = createSupabaseClient(
	import.meta.env.VITE_SUPABASE_URL as string,
	import.meta.env.VITE_SUPABASE_ANON_KEY as string
);

// result.supabaseClient is undefined only when the two parameters are not given above.
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const supabase = result.supabaseClient!;

const isSignedIn = () => Boolean(supabase.auth.user());

export { supabase, isSignedIn };
