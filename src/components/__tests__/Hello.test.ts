import { cleanup, render, screen } from '@testing-library/svelte';
import Hello from '../Hello.svelte';

describe('Hello', () => {
	afterEach(() => cleanup());

	it('mounts', () => {
		const { container } = render(Hello);
		screen.getByText('Hello');
	});
});
