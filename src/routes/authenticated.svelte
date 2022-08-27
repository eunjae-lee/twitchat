<script lang="ts">
	import { goto } from '$app/navigation';
	import { session } from '$app/stores';
	import { peekRedirectionAfterSignIn, popRedirectionAfterSignIn } from '$lib/auth';
	import { onMount } from 'svelte';

	let state: 'loading' | 'missing_email' = 'loading';

	const beingRedirectedFromTwitter =
		typeof window !== 'undefined' && window.location.hash.startsWith('#access_token=');

	$: {
		const sessionExists = $session.user && $session.user.id;

		if (sessionExists && beingRedirectedFromTwitter) {
			const redirectTo = popRedirectionAfterSignIn();
			if (redirectTo && redirectTo.startsWith('/')) {
				goto(redirectTo);
			}
		}
	}

	onMount(() => {
		const params = new URLSearchParams(window.location.href.split('?')[1]);
		if (
			params.get('error') === 'server_error' &&
			params.get('error_description') === 'Error getting user email from external provider'
		) {
			state = 'missing_email';
		}
	});
</script>

{#if state === 'loading'}
	<svg
		class="animate-spin h-8 w-8"
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
	>
		<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
		<path
			class="opacity-75"
			fill="currentColor"
			d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
		/>
	</svg>
{:else if state === 'missing_email'}
	<p>
		missing email: <a href="https://twitter.com/settings/email" target="_blank"
			>https://twitter.com/settings/email</a
		>
	</p>
{/if}
