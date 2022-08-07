export const config = {
	basePath: process.env.NODE_ENV === 'production' ? '/cactus' : '',
	url: 'http://cactuscosting.com',
	logo: `${process.env.NODE_ENV === 'production' ? '/cactus' : ''}/favicon.png`,
	base_worldbank_api: 'https://api.worldbank.org/v2/country'
};
