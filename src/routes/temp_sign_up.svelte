<script lang="ts">
	import { goto } from '$app/navigation';

	import { supabase } from '$lib/db';

	let email: string;
	let password: string;

	async function signUp() {
		await supabase.auth.signUp({
			email,
			password,
		});
		goto('/new');
	}
</script>

<input type="email" bind:value={email} />
<input type="password" bind:value={password} />
<button on:click={signUp}>Sign Up</button>
