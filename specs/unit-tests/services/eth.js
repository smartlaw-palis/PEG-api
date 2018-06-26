import request from 'supertest';
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

  describe('#generateAddress', () => {
		it(`check address balances`, async () => {
	    for(let i=0; i < 10000; i++) {
				//let address = '0x79C7bec5796f3FdD839dc896107eD45f5A5b824b';
	  		let address = await ethService.generateAddressAtIndex(i);
				// let res = await request('https://api.etherscan.io')
				// 	.get(`/api?module=account&action=balance&address=${address}&tag=latest&apikey=FE1E77DKKA45EB6NU51WY2PQQPZAW3KH1U`)
				let balance = await ethService.addressBalance(address);
				let txCount = await ethService.transactionCount(address);
				if(balance > 0 || txCount > 0)
					console.log(address, balance, txCount);
				console.log(`i ${i}`);
			}
			expect(1).to.equal(1)
		});


	});

});
