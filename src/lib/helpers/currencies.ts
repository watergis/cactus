import { countries } from 'country-data';

export interface Currency {
	code: string;
	name: string;
	iso2: string[];
	iso3: string[];
}

export const getCurrencies = async () => {
	const res = await fetch(`https://openexchangerates.org/api/currencies.json`);
	const data = await res.json();
	return Object.keys(data).map((key) => {
		const currency: Currency = { code: key, name: data[key], iso2: [], iso3: [] };
		countries.all.forEach((country) => {
			if (country.currencies.includes(currency.code)) {
				currency.iso2.push(country.alpha2);
				if (country.alpha3 !== '') {
					currency.iso3.push(country.alpha3);
				}
			}
		});
		return currency;
	});
};
