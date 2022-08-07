import { config } from '../../config';

export interface Country {
	id: string;
	iso2code: string;
	name: string;
	region: {
		id: string;
		iso2code: string;
		value: string;
	};
	adminregion: {
		id: string;
		iso2code: string;
		value: string;
	};
	incomeLevel: {
		id: string;
		iso2code: string;
		value: string;
	};
	lendingType: {
		id: string;
		iso2code: string;
		value: string;
	};
	capitalCity: string;
	longitude: string;
	latitude: string;
}

export const getCountries = async () => {
	const res = await fetch(`${config.base_worldbank_api}/all?format=json&per_page=500`);
	const data = await res.json();
	const countries: Country[] = data[1];
	return countries;
};
