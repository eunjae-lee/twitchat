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
	import { isParticipating } from '$lib/db';
	import { session } from '$app/stores';

	export let slug: string;
	let view: 'join' | 'chat' | null;

	async function checkParticipation() {
		view = (await isParticipating({ slug, user_id: $session.user.id })) ? 'chat' : 'join';
	}

	$: {
		if ($session.user && $session.user.id) {
			checkParticipation();
		}
	}
</script>

{#if view === 'join'}
	Do you want to join this room?
{:else if view === 'chat'}
	chat room here
{:else}
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
