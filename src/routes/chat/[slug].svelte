<script context="module" lang="ts">
	import type { LoadEvent } from '@sveltejs/kit';

	export function load({ params }: LoadEvent) {
		return {
			props: {
				slug: params.slug,
			},
		};
	}
</script>

<script lang="ts">
	import { isParticipating, participate } from '$lib/db';
	import { session } from '$app/stores';

	export let slug: string;
	const NEED_TO_JOIN = 'need_to_join';
	const JOINED = 'joined';
	const LOADING = 'loading';

	let status: 'need_to_join' | 'joined' | 'loading' = LOADING;

	async function checkParticipation() {
		status = (await isParticipating({ slug, user_id: $session.user.id })) ? JOINED : NEED_TO_JOIN;
	}

	$: {
		if ($session.user && $session.user.id) {
			checkParticipation();
		}
	}

	async function join() {
		await participate({ slug });
		await checkParticipation();
	}
</script>

{#if status === NEED_TO_JOIN}
	Do you want to join this room?
	<button type="button" on:click={join}>Join</button>
{:else if status === JOINED}
	chat room here
{:else if status === LOADING}
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
{/if}
