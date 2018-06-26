import dotenv from 'dotenv';
dotenv.config();
let env = process.env.NODE_ENV || 'development';

let config = {
	development: {
		port: 8000
	},
	test: {
		port: 8000
	},
	production: {
		port: 8000
	}
};

export default config[env];
