export const config = {
	basePath: process.env.NODE_ENV === 'production' ? '/cactus' : '',
	url: 'http://cactuscosting.com',
	logo: `${process.env.NODE_ENV === 'production' ? '/cactus' : ''}/favicon.png`,
	base_worldbank_api: 'https://api.worldbank.org/v2/country',
	// cactus_api: 'https://cactuscosting.com/cactus02/cactus-calcs/pull_cactus_json_app_json.php'
	cactus_api: './all_cactus_datapoint_data.json',
	attribution:
		'&copy; <a href="https://cactuscosting.com" target="_blank" rel="noopener">CACTUS project</a>'
};
