<script lang="ts">
	import { goto } from '$app/navigation';

	import { supabase } from '$lib/db';
	import { onMount } from 'svelte';

	onMount(async () => {
		const { error } = await supabase.auth.signOut();
		goto('/', { replaceState: true });
	});
</script>
