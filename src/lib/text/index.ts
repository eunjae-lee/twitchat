import { getContext } from 'svelte';

export function test() {
	return getContext('lang');
}
