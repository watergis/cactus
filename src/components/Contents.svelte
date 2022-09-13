<script lang="ts">
	import { onMount } from 'svelte';
	import Drawer, { AppContent, Content } from '@smui/drawer';
	import List, { Item, Text, Graphic } from '@smui/list';
	import Calculator from './Calculator.svelte';
	import DataTable from './DataTable.svelte';
	import Map from './Map.svelte';
	import { page } from '$app/stores';

	export let drawerOpen = false;

	let active: 'Home' | 'Data' | 'TACH calculator' | 'Map';

	let _location: Location;

	onMount(() => {
		_location = location;
		const menu = $page.url.searchParams.get('menu');
		if (!menu) {
			active = 'Home';
		} else {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			active = menu;
		}
	});

	const setMenu = (menu: 'Home' | 'Data' | 'TACH calculator' | 'Map') => {
		active = menu;
		$page.url.searchParams.set('menu', menu);
		history.replaceState('', '', $page.url.toString());
	};

	$: drawerOpen, resizeMap();
	const resizeMap = () => {
		if (!_location) return;
		if (!drawerOpen && active === 'Map') {
			_location.reload();
		}
	};
</script>

<div class="drawer-container">
	<Drawer variant="dismissible" bind:open={drawerOpen}>
		<Content>
			<List>
				<Item
					on:click={() => {
						setMenu('Home');
					}}
					activated={active === 'Home'}
				>
					<Graphic class="material-icons" aria-hidden="true">home</Graphic>
					<Text>Home</Text>
				</Item>
				<Item
					on:click={() => {
						setMenu('Map');
					}}
					activated={active === 'Map'}
				>
					<Graphic class="material-icons" aria-hidden="true">map</Graphic>
					<Text>Map</Text>
				</Item>
				<Item
					on:click={() => {
						setMenu('Data');
					}}
					activated={active === 'Data'}
				>
					<Graphic class="material-icons" aria-hidden="true">assessment</Graphic>
					<Text>Data</Text>
				</Item>
				<Item
					on:click={() => {
						setMenu('TACH calculator');
					}}
					activated={active === 'TACH calculator'}
				>
					<Graphic class="material-icons" aria-hidden="true">calculate</Graphic>
					<Text>TACH calculator</Text>
				</Item>
			</List>
		</Content>
	</Drawer>
	<AppContent class="app-content">
		<main class="main-content" style="margin: {active === 'Map' ? '0px' : '15px'}">
			{#if active === 'Home'}
				<h1 class="title">Welcome to CACTUS project</h1>
				<div class="content is-medium">
					<p>
						This is the third party website to manage some tools for the project. Please also visit
						the official website <a href="http://cactuscosting.com" target="”_blank”">here</a>
					</p>
				</div>
			{:else if active === 'Map'}
				<Map />
			{:else if active === 'Data'}
				<DataTable />
			{:else if active === 'TACH calculator'}
				<Calculator />
			{/if}
		</main>
	</AppContent>
</div>

<style lang="scss">
	$height: calc(100vh - 64px);

	@media (max-width: 768px) {
		$height: calc(100vh - 184px);
	}

	* :global(.app-content) {
		flex: auto;
		overflow: auto;
		position: relative;
		flex-grow: 1;
	}

	.main-content {
		overflow: auto;
		height: $height;
		width: calc(100vw);
		box-sizing: border-box;
	}
</style>
