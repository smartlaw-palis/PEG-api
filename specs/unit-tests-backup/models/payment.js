import models from '../../../src/models';
import config from '../../../src/config';
import chai from 'chai';
import {
	assert,
	expect
} from 'chai';
chai.should();

import {
	truncateTestDB,
	modelNames
} from '../helper';

describe('models/payment', () => {
  let model = models(config);
  let App = model.App;
  let User = model.User;
  let Payment = model.Payment;

	before(async () => {
    await truncateTestDB();
	});

  after(async () => {
		await truncateTestDB();
	});

  describe('create', () => {
		it('creates a btc payment', async () => {
			let user = await User.create({
				email: 'chanopalis@gmail.com'
			});
      let data = {
        name: 'test app',
        key: 'test key',
				UserId: user.id
			};

			let app = await App.create(data);

      data = {
        address_str: 'test address',
        note: 'test note',
				payment_type: 'btc'
			};

			let payment = await Payment.create(data);

      let keys = Object.keys(data);
      let values = Object.values(data);
      for (let i = 0; i < keys.length; i++) {
        expect(payment.dataValues[keys[i]]).to.be.equal(data[keys[i]]);
      }
		});
	});

});
