<script lang="ts">
	import { onMount } from 'svelte';
	import Grid from 'gridjs-svelte';
	import type { Row } from 'gridjs';
	import { RowSelection } from 'gridjs/plugins/selection';
	import type { CactusMasterData } from '$lib/interfaces';
	import { cactusStudyData } from '$lib/stores';
	import { getCactusStudyData } from '$lib/helpers';

	interface MasterConfig {
		column: string;
		title: string;
		type: 'Number' | 'String';
	}

	const targets: { [key: string]: MasterConfig[] } = {
		master: [
			{
				column: 'datapoint_id',
				title: 'ID',
				type: 'Number'
			},
			{
				column: 'region',
				title: 'Region',
				type: 'String'
			},
			{
				column: 'country',
				title: 'Country',
				type: 'String'
			},
			{
				column: 'country_code',
				title: 'Code',
				type: 'String'
			},
			{
				column: 'date',
				title: 'Date',
				type: 'String'
			},
			{
				column: 'city',
				title: 'City',
				type: 'String'
			},
			{
				column: 'system',
				title: 'System',
				type: 'String'
			},
			{
				column: 'element',
				title: 'Element',
				type: 'String'
			},
			{
				column: 'component',
				title: 'Component',
				type: 'String'
			},
			{
				column: 'data_collector',
				title: 'Organisation',
				type: 'String'
			},
			{
				column: 'num_hh_served',
				title: 'Number of households served',
				type: 'Number'
			},
			{
				column: 'num_people_served',
				title: 'Number of people served',
				type: 'Number'
			},
			{
				column: 'num_people_per_hh',
				title: 'Number of people per household',
				type: 'Number'
			},
			{
				column: 'tach',
				title: 'TACH$2020',
				type: 'Number'
			},
			{
				column: 'tacc',
				title: 'TACC$2020',
				type: 'Number'
			},
			{
				column: 'case_description',
				title: 'Description',
				type: 'String'
			}
		]
	};

	let style = {
		table: {
			'white-space': 'nowrap'
		}
	};

	let rowSelection = {
		id: 'id-checkbox',
		name: '',
		plugin: {
			component: RowSelection,
			props: {
				id: (row: Row) => row.cell(1).data
			}
		}
	};

	let columns = [rowSelection, ...targets.master.map((t) => t.title)];
	let tableData: (string | number)[][] = [];

	onMount(async () => {
		if (!$cactusStudyData) {
			const data = await getCactusStudyData();
			cactusStudyData.update(() => data);
		}

		tableData = [];
		$cactusStudyData.forEach((study) => {
			let data: (string | number)[] = [];
			targets.master.forEach((define) => {
				const value = study.master[define.column as keyof CactusMasterData];
				if (!value) return;
				if (define.type === 'Number') {
					data.push(Number(study.master[define.column as keyof CactusMasterData]));
				} else {
					data.push(study.master[define.column as keyof CactusMasterData]);
				}
			});
			tableData.push(data);
		});
	});

	const handleGridReady = () => {
		// console.log(e);
	};
</script>

<div class="datatable-content columns">
	<div class="column">
		<Grid
			bind:data={tableData}
			{columns}
			{style}
			pagination={true}
			search={true}
			sort={true}
			resizable={false}
			on:cellClick={handleGridReady}
		/>

		<p class="subtitle is-5">
			Hole <span class="tag is-primary">Shift</span> key to sort by multiple columns
		</p>
	</div>
</div>

<style lang="scss">
	@import 'https://cdn.jsdelivr.net/npm/gridjs/dist/theme/mermaid.min.css';

	$height: calc(100vh - 128px);

	.datatable-content {
		height: $height;
		overflow-y: scroll;
	}
</style>
