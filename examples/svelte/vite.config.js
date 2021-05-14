import { defineConfig } from 'vite';
const svelte = require('@sveltejs/vite-plugin-svelte');
import ViteComponents from 'vite-plugin-components';


export default defineConfig({
	root: './',
	build: {
		outDir: '../dist/',
		emptyOutDir: true,
	},
	plugins: [
		svelte(),
		ViteComponents({
			extensions: "svelte",
			transformer: "svelte3",
		}),
	],
});
