
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

  describe('#generateAddress', () => {

		for(let i=1; i < 5; i++) {
  		it(`generate ${i} address`, async () => {

        let address = await bitcoinService.generateAddressAtIndex(i);
        console.log(address);
				expect(1).to.equal(1);
			});
    }

	});

});
