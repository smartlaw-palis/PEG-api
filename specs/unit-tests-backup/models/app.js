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
  xPubKeys,
	modelNames
} from '../helper';

describe('models/app', () => {
  let model = models(config);
  let App = model.App;
  let User = model.User;
  let pubkeys = xPubKeys();

	before(async () => {
    await truncateTestDB();
	});

  after(async () => {
		await truncateTestDB();
	});

  describe('create', () => {
		it('creates an app', async () => {
			let user = await User.create({
				email: 'chanopalis@gmail.com'
			});

      let data = {
        name: 'test app',
        btc_xpubkey: pubkeys.btc_xpubkey,
        eth_xpubkey: pubkeys.eth_xpubkey,
        key: 'test key',
				UserId: user.id
			};

			let app = await App.create(data);
      let keys = Object.keys(data);
      let values = Object.values(data);
      for (let i = 0; i < keys.length; i++) {
        expect(app.dataValues[keys[i]]).to.be.equal(data[keys[i]]);
      }
		});

		it('return an error', async () => {
			let user = await User.create({
				email: 'chanopalis2@gmail.com'
			});

      let data = {
        name: 'test app',
        key: 'test key',
				UserId: user.id
			};

			return App.create(data)
			.then(res => {})
			.catch(err => {
				expect(err).to.not.be.null;
			})
		});

	});

});
