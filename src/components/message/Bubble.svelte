<script lang="ts">
	export let content: string;
</script>

<div class="inline-block mt-2 rounded-md py-1 px-3 bg-info text-info-content break-all">
	{#each content.split('\n') as line}
		<p>{line}</p>
	{/each}
</div>
