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

describe('models/address', () => {
  let model = models(config);
  let User = model.User;
  let BitcoinAddress = model.BitcoinAddress;
  let EthAddress = model.EthAddress;
  let pubkeys = xPubKeys();

  before(async () => {
    await truncateTestDB();
	});

  after(async () => {
		await truncateTestDB();
	});

  describe('create', () => {
		it('creates an address', async () => {
      let user = await User.create({
				email: 'chanopalis@gmail.com'
			});

      let address = await BitcoinAddress.create({
				address_str: 'test bitcoin address',
				index: 1,
				xpubkey: pubkeys.btc_xpubkey
			});

			expect(address.address_str).to.equal('test bitcoin address');
			expect(address.xpubkey).to.equal(pubkeys.btc_xpubkey);

			address = await EthAddress.create({
				address_str: 'test eth address',
				index: 0,
				xpubkey: pubkeys.eth_xpubkey
			});

			expect(address.address_str).to.equal('test eth address');
			expect(address.xpubkey).to.equal(pubkeys.eth_xpubkey);

		});
	});

});
