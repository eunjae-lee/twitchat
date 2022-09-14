<script context="module" lang="ts">
	import type { LoadEvent } from '@sveltejs/kit';
	import { getOpenGraphData } from '$lib/room';

	export async function load({ params }: LoadEvent) {
		return {
			props: {
				slug: params.slug,
				og: await getOpenGraphData({ slug: params.slug }),
			},
		};
	}
</script>

<script lang="ts">
	import { getRoom, isParticipating, participate } from '$lib/db';
	import type { OpenGraphData, Room as RoomType } from '$lib/types';
	import { session } from '$app/stores';
	import Room from '../../components/Room.svelte';
	import { getSiteTitle, room as roomText, newRoom as newRoomText, getter, merge } from '$lib/text';
	import RoomDuration from '../../components/RoomDuration.svelte';

	const t = getter(merge(roomText, newRoomText));
	export let slug: string;
	export let og: OpenGraphData;

	const NEED_TO_JOIN = 'need_to_join';
	const JOINED = 'joined';
	const LOADING = 'loading';

	let status: 'need_to_join' | 'joined' | 'loading' = LOADING;
	let room: RoomType | undefined;
	let notFound: boolean = false;

	async function checkParticipation() {
		room = (await getRoom({ slug }))!;
		if (!room) {
			notFound = true;
		}
		status = (await isParticipating({ slug, user_id: $session.user.id })) ? JOINED : NEED_TO_JOIN;
	}

	$: {
		if ($session.user && $session.user.id) {
			checkParticipation();
		}
	}

	$: canJoin = room && new Date() < new Date(room.end_ts);

	async function join() {
		await participate({ slug });
		await checkParticipation();
	}
</script>

<svelte:head>
	<title>{notFound ? 'Room not found | TwitChat' : og.title}</title>
	<meta name="description" content={og.description} />
	<meta name="author" content={og.author} />

	<!-- Facebook Meta Tags -->
	<meta property="og:url" content={og.url} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={og.title} />
	<meta property="og:description" content={og.description} />
	<meta property="og:image" content={og.image} />

	<!-- Twitter Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={og.url} />
	<meta name="twitter:title" content={og.title} />
	<meta name="twitter:description" content={og.description} />
	<meta name="twitter:image" content={og.image} />
</svelte:head>

{#if notFound}
	<div class="flex h-screen justify-center items-center">Room not found</div>
{/if}

{#if status === NEED_TO_JOIN && room}
	<div class="container narrow-container mx-auto flex flex-col items-center">
		<div class="mt-16 w-full">
			<a href="/" class="-ml-4 btn btn-ghost normal-case text-xl">
				<img src="/logo.png" alt="TwitChat logo" class="w-8" />
				<span class="ml-2">{getSiteTitle()}</span>
			</a>
		</div>

		{#if canJoin}
			<p class="mt-12 text-xl">{t('joinMessage')}</p>
		{/if}

		<div><p class="mt-12 text-2xl">{room.title}</p></div>
		<div class="mt-2 flex items-center">
			<img
				src={room.picture}
				class="rounded-full w-6"
				alt={`Profile picture of ${room.full_name}`}
			/>
			<span class="ml-2">{room.full_name}</span>
			<span class="ml-1 text-sm opacity-75">(@{room.user_name})</span>
		</div>
		{#if canJoin}
			<button class="mt-12 w-full btn btn-primary" type="button" on:click={join}>{t('join')}</button
			>
			<div class="mt-2 w-full"><RoomDuration end_ts={room.end_ts} /></div>
		{:else}
			<p class="mt-12 text-lg">{t('roomClosed')}</p>
		{/if}
	</div>
{:else if status === JOINED && room}
	<Room {room} />
{:else if status === LOADING}
	<div class="w-screen h-screen flex items-center justify-center">
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
	</div>
{/if}
