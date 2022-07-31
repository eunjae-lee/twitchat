<script lang="ts">
	import { goto } from '$app/navigation';
	import { session } from '$app/stores';
	import {
		getPayloadToCreateRoomAfterSignIn,
		setRedirectionAfterSignIn,
		storePayloadToCreateRoomAfterSignIn,
	} from '$lib/auth';
	import { createRoom, isSignedIn, supabase } from '$lib/db';
	import { getSiteTitle, getter, newRoom } from '$lib/text';
	const t = getter(newRoom);

	let title: string;
	let submitting: boolean;

	async function onSubmit() {
		submitting = true;

		if (isSignedIn()) {
			// FIXME: why doesn't it have a session even when it's already logged in?
			const room = await createRoom({ title });
			goto(`/chat/${room.slug}`);
		} else {
			storePayloadToCreateRoomAfterSignIn({ title });
			setRedirectionAfterSignIn('/new');

			await supabase.auth.signIn({
				provider: 'twitter',
			});
		}
	}

	$: {
		if ($session.user && $session.user.id) {
			const json = getPayloadToCreateRoomAfterSignIn();

			if (json) {
				title = json.title;
				submitting = true;
				createRoom({ title }).then((room) => {
					goto(`/chat/${room.slug}`);
				});
			}
		}
	}
</script>

<div class="container mx-auto flex flex-col">
	<div class="navbar">
		<div class="navbar-start">
			<a href="/" class="btn btn-ghost normal-case text-xl">
				<img src="/logo.png" alt="TwitChat logo" class="w-8" />
				<span class="ml-2">{getSiteTitle()}</span>
			</a>
		</div>
	</div>
	<div class="self-center mt-16 card w-96 bg-base-100 shadow-xl">
		<div class="card-body gap-8">
			<h2 class="card-title text-2xl justify-center">
				<span>{t('h1')}</span>
			</h2>
			<form on:submit|preventDefault={onSubmit}>
				<div class="form-control w-full max-w-xs">
					<label class="label" for="title">
						<span class="label-text">{t('titleLabel')}</span>
					</label>
					<input
						name="title"
						type="text"
						class="input input-bordered w-full max-w-xs"
						bind:value={title}
						required
					/>
					<label class="label" for="title">
						<span class="label-text-alt">{t('titlePlaceholder')}</span>
					</label>
				</div>
				<div class="mt-8 card-actions">
					<button
						type="submit"
						class="btn btn-primary grow"
						class:loading={submitting}
						disabled={submitting}><span class="ml-2">{t('startNow')}</span></button
					>
				</div>
			</form>
		</div>
	</div>
</div>
