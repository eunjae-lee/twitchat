<script lang="ts">
	import type { Participation } from '$lib/types';
	import { getter, room as roomTexts } from '$lib/text';
	const t = getter(roomTexts);

	export let participation: Participation;
</script>

<p class="text-sm text-center opacity-75">
	<a href={`https://twitter.com/${participation.user_name}`} target="_blank"
		>{participation.full_name}(@{participation.user_name})</a
	>
	{t('entered')}
</p>

<div class="flex justify-center">
	<hr class="border-base-content opacity-50 w-4" />
</div>
