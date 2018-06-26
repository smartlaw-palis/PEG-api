import {
	Router
} from 'express';

import MarketDetails from './market/details';
import mw from './middleware';

import {
	marketDetails
} from './helper';


export default () => {
	let router = Router();
	
	router.get(`/api/v1/market-details`, MarketDetails.info, mw.respond, mw.error);
	
	return router;
}
