

import {
	marketDetails
} from '../helper';

export default {
	info: (req, res, next) => {
        return marketDetails()
        .then(result => {
            req.responseData = {
                data: result,
                success: true,
            };
            next();
        })
        .catch(err => {
            console.log(err);
        })
	}
}