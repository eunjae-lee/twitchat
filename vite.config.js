import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	test: {
		globals: true,
		environment: 'jsdom',
		exclude: ['e2e/**', '**/node_modules/**'],
	},
};

export default config;
