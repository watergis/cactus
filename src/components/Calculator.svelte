<script lang="ts">
	import { onMount } from 'svelte';
	import {
		getCountries,
		getCurrencies,
		getPPP,
		type Currency,
		type Country,
		getCPI
	} from '$lib/helpers/index';
	import YearSelector from './YearSelector.svelte';
	import type { WorldBankIndicator } from '$lib/interfaces';
	import { toNumber } from 'number-string';
	import Slider from '@smui/slider';
	import AutoComplete from 'simple-svelte-autocomplete';

	let countries: Country[];
	let currencies: Currency[];
	let selectedCurrency: Currency;
	let countriesByCurrency: Country[];
	let selectedCountryCode: string;

	let currentYear = new Date().getFullYear();
	let selectedSourceYear = currentYear;
	let selectedTargetYear = 2020;
	let pppValue: number | undefined;
	let cpiSourceValue: number | undefined;
	let cpiTargetValue: number | undefined;
	let reportedCost: number | undefined;
	let eacValue: number | undefined;
	let normarisedEacValue: number | undefined;
	let costTypes = ['CapEx', 'OpEx'];
	let selectedCostType: 'CapEx' | 'OpEx' = 'CapEx';
	let lifetime: number | undefined = 30;
	let discountRate = 5;

	onMount(async () => {
		countries = await getCountries();
		currencies = await getCurrencies();
	});

	$: {
		if (selectedCurrency) {
			const currency = currencies.find((currency) => selectedCurrency.code === currency.code);
			countriesByCurrency = [];
			currency?.iso3.forEach((iso) => {
				const country = countries.find((data) => data.id === iso);
				if (!country) return;
				countriesByCurrency.push(country);
			});
			if (countriesByCurrency.length === 1) {
				selectedCountryCode = countriesByCurrency[0].id;
			}
		}
	}

	$: if (selectedCountryCode && selectedTargetYear) {
		getPPP(selectedCountryCode, selectedTargetYear).then(
			(indicator: WorldBankIndicator | undefined) => {
				if (indicator) {
					pppValue = indicator.value;
				} else {
					pppValue = undefined;
				}
			}
		);
		getCPI(selectedCountryCode, selectedTargetYear).then(
			(indicator: WorldBankIndicator | undefined) => {
				if (indicator) {
					cpiTargetValue = indicator.value;
				} else {
					cpiTargetValue = undefined;
				}
			}
		);
	}

	$: if (selectedCountryCode && selectedSourceYear) {
		getCPI(selectedCountryCode, selectedSourceYear).then(
			(indicator: WorldBankIndicator | undefined) => {
				if (indicator) {
					cpiSourceValue = indicator.value;
				} else {
					cpiSourceValue = undefined;
				}
			}
		);
	}

	$: {
		if (reportedCost) {
			try {
				reportedCost = toNumber(reportedCost);
				if (selectedCostType === 'CapEx') {
					if (lifetime) {
						lifetime = toNumber(lifetime);
						const rate = discountRate === 0 ? 0 : discountRate / 100;
						eacValue =
							(reportedCost * (rate * (1 + rate) ** lifetime)) / ((1 + rate) ** lifetime - 1);
					}
				} else {
					eacValue = reportedCost;
				}
			} catch (err) {
				eacValue = undefined;
			}
		}
	}

	$: if (eacValue && pppValue && cpiSourceValue && cpiTargetValue) {
		try {
			eacValue = toNumber(eacValue);
			normarisedEacValue = (eacValue / pppValue) * (cpiTargetValue / cpiSourceValue);
		} catch (err) {
			normarisedEacValue = undefined;
		}
	}
</script>

<div class="calculator-content">
	<h1 class="title">TACH Calculator</h1>
	<div class="content is-medium">
		<div class="columns is-vcentered">
			<div class="column is-3">
				<p class="subtitle is-6">Cost {selectedCurrency ? `(${selectedCurrency.code})` : ''}</p>
			</div>
			<div class="column is-5">
				<input
					class="input is-primary is-medium"
					type="text"
					placeholder="Reported cost"
					bind:value={reportedCost}
				/>
			</div>
		</div>
		{#if currencies && currencies.length}
			<div class="columns is-vcentered">
				<div class="column is-3">
					<p class="subtitle is-6">Currency</p>
				</div>
				<div class="column is-5">
					<AutoComplete
						items={currencies}
						bind:selectedItem={selectedCurrency}
						placeholder="Select currency"
						showClear={true}
						showLoadingIndicator={true}
						labelFunction={(properties) =>
							properties ? `${properties.name} (${properties.code})` : ''}
					/>
				</div>
			</div>
		{/if}
		{#if countriesByCurrency && countriesByCurrency.length}
			<div class="columns is-vcentered">
				<div class="column is-3">
					<p class="subtitle is-6">Country</p>
				</div>
				<div class="column is-5">
					<div class="select is-primary is-medium">
						<select bind:value={selectedCountryCode}>
							{#each countriesByCurrency as country}
								<option value={country.id}>{`${country.name} (${country.id})`}</option>
							{/each}
						</select>
					</div>
				</div>
			</div>
		{/if}
		<div class="columns is-vcentered">
			<div class="column is-3">
				<p class="subtitle is-6">Cost type</p>
			</div>
			<div class="column is-5">
				<div class="select is-primary is-medium">
					<select bind:value={selectedCostType}>
						{#each costTypes as costType}
							<option value={costType}>{`${costType}`}</option>
						{/each}
					</select>
				</div>
			</div>
		</div>
		{#if selectedCostType === 'CapEx'}
			<div class="columns is-vcentered">
				<div class="column is-3">
					<p class="subtitle is-6">Lifetime (year)</p>
				</div>
				<div class="column is-5">
					<input
						class="input is-primary is-medium"
						type="text"
						placeholder="Lifetime"
						bind:value={lifetime}
					/>
				</div>
			</div>
		{/if}
		<div class="columns is-vcentered">
			<div class="column is-3">
				<p class="subtitle is-6">Year purchased</p>
			</div>
			<div class="column is-3">
				<YearSelector bind:selectedYear={selectedSourceYear} />
			</div>
		</div>
		<div class="columns is-vcentered">
			<div class="column is-3">
				<p class="subtitle is-6">Discount rate: {discountRate}%</p>
			</div>
			<div class="column is-5">
				<Slider
					bind:value={discountRate}
					min={0}
					max={100}
					step={0.5}
					discrete
					tickMarks
					input$aria-label="Discrete slider"
				/>
			</div>
		</div>
		<div class="columns is-vcentered">
			<div class="column is-3">
				<p class="subtitle is-6">
					Annual cost {selectedCurrency ? `(${selectedCurrency.code})` : ''}
				</p>
			</div>
			<div class="column is-5">
				<input
					class="input is-secondary is-medium"
					type="text"
					placeholder="Annualised cost"
					bind:value={eacValue}
					readonly
				/>
			</div>
		</div>
		<hr />
		<div class="columns is-vcentered">
			<div class="column is-3">
				<p class="subtitle is-6">Year converted to</p>
			</div>
			<div class="column is-3">
				<YearSelector bind:selectedYear={selectedTargetYear} />
			</div>
		</div>
		{#if selectedCountryCode && selectedTargetYear}
			<div class="columns is-vcentered">
				<div class="column is-3">
					<p class="subtitle is-6">{`PPP-${selectedCountryCode}/US-${selectedTargetYear}`}</p>
				</div>
				<div class="column is-5">
					<input
						class="input is-secondary is-medium"
						type="text"
						placeholder="PPP value"
						bind:value={pppValue}
						readonly
					/>
				</div>
			</div>
			<div class="columns is-vcentered">
				<div class="column is-3">
					<p class="subtitle is-6">{`CPI-${selectedCountryCode}-${selectedTargetYear}`}</p>
				</div>
				<div class="column is-5">
					<input
						class="input is-secondary is-medium"
						type="text"
						placeholder="CPI target value"
						bind:value={cpiTargetValue}
						readonly
					/>
				</div>
			</div>
		{/if}
		{#if selectedCountryCode && selectedSourceYear}
			<div class="columns is-vcentered">
				<div class="column is-3">
					<p class="subtitle is-6">{`CPI-${selectedCountryCode}-${selectedSourceYear}`}</p>
				</div>
				<div class="column is-5">
					<input
						class="input is-secondary is-medium"
						type="text"
						placeholder="CPI source value"
						bind:value={cpiSourceValue}
						readonly
					/>
				</div>
			</div>
		{/if}
		<div class="columns is-vcentered">
			<div class="column is-3">
				<p class="subtitle is-6">{`US$${selectedTargetYear}`}</p>
			</div>
			<div class="column is-5">
				<input
					class="input is-secondary is-medium"
					type="text"
					placeholder="Output value"
					bind:value={normarisedEacValue}
				/>
			</div>
		</div>
		<hr />
		<h1 class="title is-4">References</h1>
		<ol>
			<li>
				<a href="http://dx.doi.org/10.2166/washdev.2020.093" target="”_blank”">
					<p>
						Sainati, T., Zakaria, F., Locatelli, G., Sleigh, P.A. and Evans, B. 2020. Understanding
						the costs of urban sanitation: Towards a standard costing model. Journal of Water
						Sanitation and Hygiene for Development. 10(4), pp.642–658.
					</p>
				</a>
			</li>
		</ol>
	</div>
</div>

<style lang="scss">
	$height: calc(100vh - 128px);

	.calculator-content {
		height: $height;
		overflow-y: scroll;
	}

	:global(.autocomplete) {
		width: 100%;
	}

	:global(.autocomplete-input) {
		background-color: #fff;
		border: 1px solid #ccc;
		box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.1);
		color: #4a4a4a;
		font-family: ProximaNova, sans-serif;
		font-size: 11px;
		height: 50px !important;
	}

	:global(.autocomplete-list) {
		top: 5px !important;
		background-color: #fff;
		border-radius: 10px;
		border: 1px solid #ccc;
		box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.1);
	}
</style>
