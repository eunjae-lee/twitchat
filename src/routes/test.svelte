<script lang="ts">
	import { session } from '$app/stores';
</script>

{#if !$session.user}
	<h1>I am not logged in</h1>
{:else}
	<h1>Welcome {$session.user.email}</h1>
	<p>I am logged in!</p>
{/if}
