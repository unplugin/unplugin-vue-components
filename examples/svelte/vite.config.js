import { defineConfig } from 'vite';
import Svelte from "@sveltejs/vite-plugin-svelte"
import ViteComponents from 'vite-plugin-components';


export default defineConfig({
	root: './',
	build: {
		outDir: '../dist/',
		emptyOutDir: true,
	},
	plugins: [
		Svelte(),
		ViteComponents(),
	],
});
