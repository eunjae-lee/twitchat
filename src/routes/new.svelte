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
	import type { Lang } from '$lib/types';
	import { getContext } from 'svelte';
	import RoomDuration from '../components/RoomDuration.svelte';
	const t = getter(newRoom);
	const lang = getContext<Lang>('lang');

	let title: string;
	let submitting: boolean;
	let cannotCreateAnotherRoom: boolean;

	function createRoomAndGo(title: string) {
		createRoom({ title, lang })
			.then((room) => {
				goto(`/c/${room.slug}`);
			})
			.catch((error) => {
				if (error.message === 'cannot create another room') {
					cannotCreateAnotherRoom = true;
				}
			});
	}

	async function onSubmit() {
		submitting = true;

		if ($session.user?.id) {
			createRoomAndGo(title);
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
				createRoomAndGo(title);
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
		<div class="mt-8">
			{#if cannotCreateAnotherRoom}
				<div class="alert alert-warning shadow-lg">
					<div>
						<svg class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
							/></svg
						>
						{#if cannotCreateAnotherRoom}
							<span>{t('cannotCreateAnotherRoom')}</span>
						{/if}
					</div>
				</div>
			{:else}
				<button
					type="submit"
					class="btn btn-primary w-full"
					class:loading={submitting}
					disabled={submitting}><span class="ml-2">{t('startNow')}</span></button
				>
				<div class="mt-2"><RoomDuration creating={true} /></div>
			{/if}
		</div>
	</form>
</div>
