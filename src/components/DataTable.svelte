<script lang="ts">
	import { onMount } from 'svelte';
	import Grid from 'gridjs-svelte';
	import type { CactusData, CactusMasterData, CactusStudyData } from '$lib/interfaces';

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

	let columns = targets.master.map((t) => t.title);
	let tableData: (string | number)[][] = [];

	onMount(async () => {
		const res = await fetch('./all_cactus_datapoint_data.json');
		const json: CactusData = await res.json();
		const study_data: CactusStudyData[] = json.study_data;
		tableData = [];
		study_data.forEach((study) => {
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
