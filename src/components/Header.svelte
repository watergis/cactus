<script lang="ts">
import { onMount } from 'svelte';
	import type { TopAppBarComponentDev } from '@smui/top-app-bar';
	import TopAppBar, { Row, Section, Title, AutoAdjust } from '@smui/top-app-bar';
	import IconButton from '@smui/icon-button';
    import { config } from '../config';

    export let drawerOpen = false;

    let darkTheme: boolean;
	let topAppBar: TopAppBarComponentDev;

	$: modeLabel = `switch to ${darkTheme ? 'light' : 'dark'} mode`;

	// This icon represents the mode to which the user can switch.
	$: modeIcon = darkTheme ? 'light_mode' : 'dark_mode';

	onMount(async () => {
		darkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
	});
	const toggleMode = () => {
        drawerOpen = false;
		darkTheme = !darkTheme;
	};
</script>

<svelte:head>
	{#if darkTheme === undefined}
		<link
			rel="stylesheet"
			href="{config.basePath}/smui.css"
			media="(prefers-color-scheme: light)"
		/>
		<link
			rel="stylesheet"
			href="{config.basePath}/smui-dark.css"
			media="screen and (prefers-color-scheme: dark)"
		/>
	{:else if darkTheme}
		<link rel="stylesheet" href="{config.basePath}/smui.css" media="print" />
		<link rel="stylesheet" href="{config.basePath}/smui-dark.css" media="screen" />
	{:else}
		<link rel="stylesheet" href="{config.basePath}/smui.css" />
	{/if}
</svelte:head>

<TopAppBar bind:this={topAppBar} variant="fixed">
	<Row>
        <Section>
			<a href={config.url}>
				<img src={config.logo} alt="logo" class="logo" />
			</a>
			<Title>{config.title}</Title>
        </Section>
		<Section align="end" toolbar>
			<IconButton
				aria-label={modeLabel}
				class="material-icons"
				on:click={toggleMode}
				title={modeLabel}
			>
				{modeIcon}
			</IconButton>
            <IconButton class="material-icons" on:click={() => (drawerOpen = !drawerOpen)}>
				{#if !drawerOpen}
					menu
				{:else}
					close
				{/if}
			</IconButton>
		</Section>
	</Row>
</TopAppBar>
<AutoAdjust {topAppBar} />

<style>
.logo {
		height: 48px;
        background-color: white;
	}
</style>