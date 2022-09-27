<script lang="ts">
	export let content: string;
	export let type: 'text' | 'emoji';

	let emojiContent = type === 'emoji' ? JSON.parse(content) : null;
</script>

<div
	class="inline-block mt-2 rounded-md py-1 px-3 bg-info text-info-content break-all"
	class:text-3xl={type === 'emoji'}
>
	{#if type === 'text'}
		{#each content.split('\n') as line}
			<p>{line}</p>
		{/each}
	{:else if type === 'emoji'}
		<p>{emojiContent.emoji}</p>
	{/if}
</div>
