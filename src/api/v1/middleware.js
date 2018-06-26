
import dotenv from 'dotenv';
dotenv.config();

export default {

	respond: (req, res, next) => {
		res.status(200).json(req.responseData);
		next();
	},

	error: (err, req, res, next) => {
		if (!err) err = new Error('an error has occurred');
		var code = err.status || 500;

		// util.log(util.format('Error [%s]: %s', req.url, err.message));
		// if (code !== 404 && code !== 403) {
		// 	// not logging traces for 404 and 403 errors
		// 	util.log(util.inspect(err.stack));
		// }

		if ('ETIMEDOUT' === err.code || 'ENOTFOUND' === err.code) {
			err.message = 'Error connecting upstream servers';
		}

		if ('POST' === req.method) {
			if (err.status === 403) {
				err.errorDetails = 'Session and/or token expired.';
			}
		}
		if (req.xhr || req.isapi) {
			res.json({
				result: 'failure',
				code: code || 1,
				success: 0,
				error: err.message,
				message: err.errorDetails || err.message
			});
		} else {
			res.status(400).send({
				error: err.message,
				success: false,
				result: 'failure'
			});
		}
	}
}
