import { sveltekit } from '@sveltejs/kit/vite';
import { resolve } from 'path';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	resolve: {
		alias: {
			$components: resolve('./src/components'),
			$stores: resolve('./src/lib')
		}
	}
};

export default config;
