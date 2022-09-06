<script lang="ts">
	import { goto } from '$app/navigation';
	import { session } from '$app/stores';
	import {
		popPayloadToCreateRoomAfterSignIn,
		setRedirectionAfterSignIn,
		storePayloadToCreateRoomAfterSignIn,
	} from '$lib/auth';
	import { createRoom, supabase } from '$lib/db';
	import { getSiteTitle, getter, newRoom } from '$lib/text';
	const t = getter(newRoom);

	let title: string;
	let submitting: boolean;

	async function onSubmit() {
		submitting = true;

		if ($session.user?.id) {
			const room = await createRoom({ title });
			goto(`/c/${room.slug}`);
		} else {
			storePayloadToCreateRoomAfterSignIn({ title });
			setRedirectionAfterSignIn('/new');

			await supabase.auth.signIn(
				{
					provider: 'twitter',
				},
				{ redirectTo: window.location.origin + '/authenticated' }
			);
		}
	}

	$: {
		if ($session.user && $session.user.id) {
			const json = popPayloadToCreateRoomAfterSignIn();

			if (json) {
				title = json.title;
				submitting = true;
				createRoom({ title }).then((room) => {
					goto(`/c/${room.slug}`);
				});
			}
		}
	}
</script>

<div class="container narrow-container mx-auto flex flex-col items-center">
	<div class="mt-16 w-full">
		<a href="/" class="-ml-4 btn btn-ghost normal-case text-xl">
			<img src="/logo.png" alt="TwitChat logo" class="w-8" />
			<span class="ml-2">{getSiteTitle()}</span>
		</a>
	</div>
	<form class="mt-12 w-full" on:submit|preventDefault={onSubmit}>
		<div class="form-control w-full max-w-xs">
			<label class="label" for="title">
				<span class="label-text">{t('titleLabel')}</span>
			</label>
			<input
				name="title"
				type="text"
				class="input input-bordered w-full max-w-xs"
				bind:value={title}
				autofocus
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
