<script lang="ts">
	import { goto } from '$app/navigation';
	import { getter, merge, landing, common } from '$lib/text';
	const t = getter(merge(landing, common));

	if (typeof window !== 'undefined' && window.location.hash.startsWith('#access_token=')) {
		const redirectTo = localStorage.getItem('redirect_to');
		localStorage.removeItem('redirect_to');
		if (redirectTo && redirectTo.startsWith('/')) {
			goto(redirectTo);
		}
	}
</script>

<div class="container mx-auto">
	<div class="navbar bg-base-100">
		<div class="navbar-start">
			<a href="/" class="btn btn-ghost normal-case text-xl">
				<img src="/logo.png" alt="TwitChat logo" class="w-8" />
				<span class="ml-2">{t('title')}</span>
			</a>
		</div>
		<div class="navbar-end">
			<a href="/new" class="btn btn-primary">{t('newChat')}</a>
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
				<button class="btn btn-primary">{t('newChat')}</button>
			</div>
		</div>
	</div>
</div>
