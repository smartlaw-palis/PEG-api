
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

import app from '../../../src/services/app';

describe('services/app', () => {
  let model = models(config);
  let App = model.App;
  let User = model.User;
  let appService = app.appService;
  let testUser = null;

	before(async () => {
		await truncateTestDB();
    testUser = await User.create({
      email: 'chanopalis123@gmail.com',
      password: '123'
    });
    let data = {
      name: 'test app',
      btc_xpubkey: 'test btc xPubKey',
      eth_xpubkey: 'test eth xPubKey',
      key: 'test key',
      UserId: testUser.id
    };

    let app = await App.create(data);
	});

	after(async () => {
		await truncateTestDB();
	});

	[
		'generateKey',
		'isKeyExist',
		'create',
	].forEach(method => {
		it(`${method} should be a function`, () => {
			expect(appService[method]).to.be.a('function');
		});
	});

  describe('#generateKey', () => {
		it('should return a Promise', () => {
			let res = appService.generateKey();
			expect(res.then).to.be.a('function');
			expect(res.catch).to.be.a('function');
		})

    it('should create new unique key', async () => {
			let key = await appService.generateKey();
			let isExist = await App.findOne({
        where: {
          key: key
        }
      });
			expect(isExist).to.be.null;
    });
	});

  describe('#isKeyExist', () => {
		it('should return a Promise', () => {
			let res = appService.isKeyExist('123');
			expect(res.then).to.be.a('function');
			expect(res.catch).to.be.a('function');
		})

    it('should return false', async () => {
			let res = await appService.isKeyExist('123');
			expect(res).to.be.false;
		})

    it('should return true', async () => {
			let res = await appService.isKeyExist('test key');
			expect(res).to.be.true;
		})
	});

	describe('#create', () => {
		it('should return a Promise', async () => {
			let res = appService.create({
				name: 'test app 2',
        btc_xpubkey: 'test btc xPubKey',
				eth_xpubkey: 'test eth xPubKey',
        UserId: testUser.id
			})
			expect(res.then).to.be.a('function');
			expect(res.catch).to.be.a('function');
		})
		it('should create new app', async () => {
			let app = await appService.create({
        name: 'new app inserted',
        btc_xpubkey: 'btc key',
				eth_xpubkey: 'eth key',
        UserId: testUser.id
			});
			let resApp = await App.findOne({
        where: {
          key: app.key
        }
      });
			expect(resApp.id).to.equal(app.id);
      expect(resApp.btc_xpubkey).to.equal('btc key');
			expect(resApp.eth_xpubkey).to.equal('eth key');
    });
	});

});
