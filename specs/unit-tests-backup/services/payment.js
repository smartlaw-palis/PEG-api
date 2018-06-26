
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

import payment from '../../../src/services/payment';

describe('services/payment', () => {
  let model = models(config);
  let Payment = model.Payment;
  let App = model.App;
  let User = model.User;
  let paymentService = payment.paymentService;
  let pubkeys = xPubKeys();
  let appId = null;
	let appApiKey = 'test key';

	before(async () => {
		await truncateTestDB();
    let user = await User.create({
      email: 'chanopalis@gmail.com'
    });

    let data = {
      name: 'test app',
      btc_xpubkey: pubkeys.btc_xpubkey,
      eth_xpubkey: pubkeys.eth_xpubkey,
      key: appApiKey,
      UserId: user.id
    };

    let app = await App.create(data);
    appId = app.id;
	});

	after(async () => {
		await truncateTestDB();
	});

	[
		'getPaymentByTxId',
		'createPayment',
		'generateTxId',
	].forEach(method => {
		it(`${method} should be a function`, () => {
			expect(paymentService[method]).to.be.a('function');
		});
	});

  describe('#generateTxId', () => {
		it('should return a Promise', () => {
			let res = paymentService.generateTxId();
			expect(res.then).to.be.a('function');
			expect(res.catch).to.be.a('function');
		})

    it('should create new unique txid', async () => {
			let id = await paymentService.generateTxId();
			let isExist = await Payment.findOne({
        where: {
          txid: id
        }
      });
			expect(isExist).to.be.null;
    });
	});

	describe('#createPayment', () => {
		it('should return a Promise', () => {
			let res = paymentService.createPayment(appApiKey, {
				payment_type: 'btc',
				note: 'testing',
				amount: 100
			});
			expect(res.then).to.be.a('function');
			expect(res.catch).to.be.a('function');
		})
		it('should create new payment request', async () => {
			let res = await paymentService.createPayment(appApiKey, {
				payment_type: 'btc',
				note: 'creating new payment',
				amount: 0
			});
			let payment = await paymentService.getPaymentByTxId(res.txid);
			expect(payment.AppId).to.equal(appId);
			expect(payment.payment_type).to.equal('btc');
			expect(payment.note).to.equal('creating new payment');
    });
	});

});
