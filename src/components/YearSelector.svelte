<script lang="ts">
	import NumericRange from 'numeric-range';

	let currentYear = new Date().getFullYear();
	export let selectedYear = currentYear;
	let years = new NumericRange(1960, currentYear).enumerate().reverse();
</script>

<div class="select is-primary is-small">
	<select bind:value={selectedYear}>
		{#each years as year}
			<option value={year}>{`${year}`}</option>
		{/each}
	</select>
</div>

<style lang="scss">
</style>
