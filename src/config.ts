export const config = {
	basePath: process.env.NODE_ENV === 'production' ? '/tach-calc' : '',
	url: 'http://cactuscosting.com',
	logo: `${process.env.NODE_ENV === 'production' ? '/tach-calc' : ''}/favicon.png`
};
