import models from '../../../src/models';
import config from '../../../src/config';
import request from 'supertest';
import chai from 'chai';
import {
	assert,
	expect
} from 'chai';
chai.should();

import {
	truncateTestDB,
  server
} from '../../unit-tests/helper';

import user from '../../../src/services/user';
import app from '../../../src/services/app';
import payment from '../../../src/services/payment';

describe('payment/app-payments', () => {

  let url = server();
  let baseURL = '/api/v1/app';
  let userService = user.userService;
  let appService = app.appService;
  let paymentService = payment.paymentService;
	let userToken = null;
  let userToken2 = null;
  let adminToken = null;
	let testUser = null;
  let testApp = null;

  before(async() => {
		await truncateTestDB();
    let adminUser = await userService.register({
      email: 'user1@gmail.com',
      first_name: 'user1',
      last_name: 'user1',
			password: '123',
      confirm_password: '123',
    });
    adminToken = await userService.generateToken(adminUser.id, 'user1@gmail.com', adminUser.uuid);
		await userService.update(adminUser.id, {role: 'admin'});

    testUser = await userService.register({
      email: 'user2@gmail.com',
      first_name: 'user2',
      last_name: 'user2',
			password: '123',
      confirm_password: '123',
    });
    userToken = await userService.generateToken(testUser.id, 'user2@gmail.com', testUser.uuid);

		let testUser2 = await userService.register({
      email: 'user3@gmail.com',
      first_name: 'user2',
      last_name: 'user2',
			password: '123',
      confirm_password: '123',
    });
    userToken2 = await userService.generateToken(testUser2.id, 'user3@gmail.com', testUser2.uuid);

    let appData = {
			name: 'Testing App',
      btc_xpubkey: 'tpubD6NzVbkrYhZ4YahP3U1iX4VwM6WH2gkY7a2Q5j33ET4rsSsbUZaJrhvm3Pg1EsSXSBUEG3YXZqGDxdQdJkZdDw6nynAGHs8Cfuh42EoYahd',
      eth_xpubkey: 'xpub6F3UDWWniqSUcfPied5SPqhBTFuYwAS2dGPQo1Sjpen4tDN1p4cdwGQAEQRjjvpZViBs8Du6uW2YXgirbGxo8avtX54WLWwFRZnAqAj9WyH',
			token_price: 0.1,
			unit_price: 'usd',
      UserId: testUser.id
		};

    testApp = await appService.create(appData);
    let payment = await paymentService.createPayment(testApp.key, {
                    payment_type: 'btc'
              		});
    payment = await paymentService.createPayment(testApp.key, {
                payment_type: 'eth'
              });
	});

	after(async () => {
		await truncateTestDB();
	});

	it('should return unauthorized error when without token', (done) => {
		request(url)
			.get(`${baseURL}/${testApp.uuid}/payments/10/1`)
			.expect('Content-Type', /json/)
			.expect(401)
			.end((err, res) => {
				if (err)
					return done(err);

        res.body.message.should.equal('Invalid Token or Key');
        done();
			});
	});

  it('should return unauthorized error when with token', (done) => {
		request(url)
			.get(`${baseURL}/${testApp.uuid}/payments/10/1`)
			.expect('Content-Type', /json/)
      .set('Token', userToken2)
			.expect(400)
			.end((err, res) => {
				if (err)
					return done(err);

        res.body.error.should.equal('Unathorized access.');
        done();
			});
	});

  it('should return correct data', (done) => {
		request(url)
			.get(`${baseURL}/${testApp.uuid}/payments/10/1`)
      .set('Token', adminToken)
			.expect('Content-Type', /json/)
			.expect(200)
			.end((err, res) => {
				if (err)
					return done(err);

        res.body.data.length.should.equal(2);
        res.body.perPage.should.equal(10);
        res.body.pages.should.equal(1);
        res.body.page.should.equal(1);
        done();
			});
	});

});
