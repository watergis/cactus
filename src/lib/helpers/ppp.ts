import type { WorldBankIndicator } from '$lib/interfaces';
import { config } from '../../config';

export const getPPP = async (countryCode: string, year: number) => {
	const res = await fetch(
		`${config.base_worldbank_api}/${countryCode}/indicator/PA.NUS.PPP/?format=json&date=${year}`
	);
	const data = await res.json();
	if (data[1]) {
		const indicator: WorldBankIndicator = data[1][0];
		return indicator;
	} else {
		return;
	}
};
