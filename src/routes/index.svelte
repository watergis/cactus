<script lang="ts">
	import Header from '../components/Header.svelte';
	import Contents from '../components/Contents.svelte';

	let drawerOpen = false;
</script>

<Header bind:drawerOpen />
<Contents bind:drawerOpen />

<style lang="scss">
	@import 'bulma/css/bulma.css';
</style>
