
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
  xPubKeys
} from '../helper';

import bitcoin from '../../../src/services/bitcoin';

describe('services/bitcoin', () => {
  let model = models(config);
  let User = model.User;
  let BitcoinAddress = model.BitcoinAddress;
  let bitcoinService = bitcoin.bitcoinService;
  let pubkeys = xPubKeys();
  bitcoinService.setXPubKey(pubkeys.btc_xpubkey);

	before(async () => {
		await truncateTestDB();
	});

	after(async () => {
		await truncateTestDB();
	});

	[
		'setXPubKey',
		'generateAddress',
		'addressBalance'
	].forEach(method => {
		it(`${method} should be a function`, () => {
			expect(bitcoinService[method]).to.be.a('function');
		});
	});

	describe('#addressBalance', () => {
		it('should return correct balance of an address', async () => {
			let details = await bitcoinService.addressBalance('mxEUoa5tn76QL3rztVF3obVL1fHyKigg4b');
			expect(Number(details.balance)).to.be.above(0);
			expect(Number(details.unconfirmed_balance)).to.be.equal(0);
		});
	});

  describe('#generateAddress', () => {

		for(let i=1; i < 100; i++) {
  		it(`generate ${i} address`, async () => {

        let address = await bitcoinService.generateAddress();
        let addressObj = await BitcoinAddress.findOne({
          where: {
            xpubkey: pubkeys.btc_xpubkey,
            index: i
          },
          order: [
            ['index', 'ASC']
          ]
        });

        expect(address).to.equal(addressObj.dataValues.address_str);
        expect(i).to.equal(addressObj.dataValues.index);
        expect(pubkeys.btc_xpubkey).to.equal(addressObj.dataValues.xpubkey);
			});
    }

		it('should return a Promise', () => {
			let address = bitcoinService.generateAddress();
			expect(address.then).to.be.a('function');
			expect(address.catch).to.be.a('function');
		})

	});

});
