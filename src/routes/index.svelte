<script lang="ts">
	import { goto } from '$app/navigation';
	import { session } from '$app/stores';
	import { popRedirectionAfterSignIn } from '$lib/auth';
	import { getter, landing, getSiteTitle } from '$lib/text';
	const t = getter(landing);

	$: {
		const sessionExists = $session.user && $session.user.id;
		const beingRedirectedFromTwitter =
			typeof window !== 'undefined' && window.location.hash.startsWith('#access_token=');

		if (sessionExists && beingRedirectedFromTwitter) {
			const redirectTo = popRedirectionAfterSignIn();
			if (redirectTo && redirectTo.startsWith('/')) {
				goto(redirectTo);
			}
		}
	}
</script>

<div class="container mx-auto">
	<div class="navbar">
		<div class="navbar-start">
			<a href="/" class="btn btn-ghost normal-case text-xl">
				<img src="/logo.png" alt="TwitChat logo" class="w-8" />
				<span class="ml-2">{getSiteTitle()}</span>
			</a>
		</div>
		<div class="navbar-end">
			<a sveltekit:prefetch href="/new" class="btn btn-sm btn-primary">{t('newChat')}</a>
		</div>
	</div>

	<div class="hero min-h-screen">
		<div class="hero-content text-center">
			<div class="max-w-md">
				<h1 class="text-5xl font-bold">Hello there</h1>
				<p class="py-6">
					Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi
					exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.
				</p>
				<a sveltekit:prefetch href="/new" class="btn btn-primary">{t('newChat')}</a>
			</div>
		</div>
	</div>
</div>
