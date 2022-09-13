<script lang="ts">
	import { GeoJSONFeature, MapMouseEvent, Popup } from 'maplibre-gl';
	import { map, cactusStudyData } from '$lib/stores';
	import { getCactusStudyData } from '$lib/helpers';

	let popupContainer: HTMLDivElement;
	let clickedFeatures: GeoJSONFeature[] = [];
	let selectedFeature: GeoJSONFeature | undefined;

	$: if ($map) {
		$map.on('load', async function () {
			const geojson = await convert2geojson();

			$map.addSource('cactus-data', {
				type: 'geojson',
				data: geojson
			});

			$map.addLayer({
				id: 'cactus-data',
				type: 'circle',
				source: 'cactus-data',
				paint: {
					'circle-color': '#11b4da',
					'circle-radius': 8,
					'circle-stroke-width': 1,
					'circle-stroke-color': '#fff'
				}
			});

			$map.on('click', 'cactus-data', function (e: MapMouseEvent) {
				const features = $map.queryRenderedFeatures(e.point, {
					layers: ['cactus-data']
				});
				clickedFeatures = features;
				selectedFeature = undefined;

				if (features.length === 0) return;
				selectedFeature = clickedFeatures[0];
				new Popup()
					.setLngLat(e.lngLat)
					.setDOMContent(popupContainer)
					.setMaxWidth('400px')
					.addTo($map);
			});
		});
	}

	const convert2geojson = async () => {
		if (!$cactusStudyData) {
			const data = await getCactusStudyData();
			cactusStudyData.update(() => data);
		}

		const features: GeoJSONFeature[] = [];

		$cactusStudyData.forEach((study) => {
			const master = study.master;

			const feature = {
				id: master.datapoint_id,
				type: 'Feature',
				geometry: { type: 'Point', coordinates: [Number(master.lon), Number(master.lat)] },
				properties: master
			};
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			features.push(feature);
		});
		return {
			type: 'FeatureCollection',
			features: features
		};
	};
</script>

<div bind:this={popupContainer}>
	{#if clickedFeatures && clickedFeatures.length > 0}
		<div class="select is-small is-success">
			<select bind:value={selectedFeature}>
				{#each clickedFeatures as feature}
					<option value={feature}
						>{feature.properties.datapoint_id}: {feature.properties.component}</option
					>
				{/each}
			</select>
		</div>
		{#if selectedFeature}
			<div class="popup-table">
				<table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
					<tr><th>System</th><td>{selectedFeature.properties.system}</td></tr>
					<tr><th>Element</th><td>{selectedFeature.properties.element}</td></tr>
					<tr><th>Component</th><td>{selectedFeature.properties.component}</td></tr>
					<tr><th>Data collector</th><td>{selectedFeature.properties.data_collector}</td></tr>
					<tr><th>TACH (Int$2020)</th><td>{selectedFeature.properties.tach.toFixed()}</td></tr>
					<tr><th>TACC (Int$2020)</th><td>{selectedFeature.properties.tacc.toFixed()}</td></tr>
					<tr><th>Description</th><td>{selectedFeature.properties.case_description}</td></tr>
					<tr>
						<th>Number of households served</th>
						<td>{selectedFeature.properties.num_hh_served}</td>
					</tr>
					<tr>
						<th>Number of people served</th>
						<td>{selectedFeature.properties.num_people_served}</td>
					</tr>
					<tr>
						<th>Coordinates</th>
						<td>{selectedFeature.properties.lon}, {selectedFeature.properties.lat}</td>
					</tr>
					<tr><th>City</th><td>{selectedFeature.properties.city}</td></tr>
					<tr><th>Country</th><td>{selectedFeature.properties.country}</td></tr>
					<tr><th>Region</th><td>{selectedFeature.properties.region}</td></tr>
					<tr><th>Date</th><td>{selectedFeature.properties.date}</td></tr>
				</table>
			</div>
		{/if}
	{/if}
</div>

<style lang="scss">
	.popup-table {
		max-height: 300px;
		overflow-y: auto;
	}
</style>
