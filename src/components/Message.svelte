<script lang="ts">
	import type { Message, Participation } from '$lib/types';

	export let message: Message;
	export let participation: Participation;
</script>

<div>
	{message.content}
	{participation.full_name}
	<img
		class="rounded-full"
		src={participation.picture}
		alt={`Profile picture of ${participation.full_name}`}
	/>
</div>
