
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

import eth from '../../../src/services/eth';

describe('services/eth', () => {
  let model = models(config);
  let User = model.User;
  let EthAddress = model.EthAddress;
  let ethService = eth.ethService;
	let pubkeys = xPubKeys();
  ethService.setXPubKey(pubkeys.eth_xpubkey);

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
			expect(ethService[method]).to.be.a('function');
		});
	});

	describe('#addressBalance', () => {
		it('should return correct balance of an address', async () => {
			let balance = await ethService.addressBalance('0x347941f3dE607F4b39077910D4bAaA236Eef1AEE');
			expect(Number(balance)).to.be.above(0);
		});
	});

  describe('#generateAddress', () => {

    for(let i=0; i < 5; i++) {
  		it(`generate ${i} address`, async () => {

        let address = await ethService.generateAddress();
        let addressObj = await EthAddress.findOne({
          where: {
            xpubkey: pubkeys.eth_xpubkey,
            index: i
          },
          order: [
            ['index', 'ASC']
          ]
        });

        expect(address).to.equal(addressObj.dataValues.address_str);
        expect(i).to.equal(addressObj.dataValues.index);
        expect(pubkeys.eth_xpubkey).to.equal(addressObj.dataValues.xpubkey);
  		});
    }

		it('should return a Promise', () => {
			let address = ethService.generateAddress();
			expect(address.then).to.be.a('function');
			expect(address.catch).to.be.a('function');
		})

	});

});
