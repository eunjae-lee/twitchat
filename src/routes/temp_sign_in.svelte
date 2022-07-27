<script lang="ts">
	import { goto } from '$app/navigation';

	import { supabase } from '$lib/db';

	let email: string;
	let password: string;

	async function signIn() {
		await supabase.auth.signIn({
			email,
			password,
		});
		goto('/new');
	}
</script>

<input type="email" bind:value={email} />
<input type="password" bind:value={password} />
<button on:click={signIn}>Sign In</button>
