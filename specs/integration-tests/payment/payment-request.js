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

describe('payment/payment-request', () => {

  let url = server();
  let baseURL = '/api/v1/payment';
  let userService = user.userService;
  let appService = app.appService;
  let testApp = null;
  let btc_xpubkey = 'tpubD6NzVbkrYhZ4YahP3U1iX4VwM6WH2gkY7a2Q5j33ET4rsSsbUZaJrhvm3Pg1EsSXSBUEG3YXZqGDxdQdJkZdDw6nynAGHs8Cfuh42EoYahd';
  let eth_xpubkey = 'xpub6F3UDWWniqSUcfPied5SPqhBTFuYwAS2dGPQo1Sjpen4tDN1p4cdwGQAEQRjjvpZViBs8Du6uW2YXgirbGxo8avtX54WLWwFRZnAqAj9WyH';

  before(async() => {
		truncateTestDB();
    let testUser = await userService.register({
      email: 'user1@gmail.com',
      first_name: 'user1',
      last_name: 'user1',
			password: '123',
      confirm_password: '123',
    });
    testApp = await appService.create({
      name: 'Testing App',
      btc_xpubkey: btc_xpubkey,
      eth_xpubkey: eth_xpubkey,
			token_price: 0.1,
			unit_price: 'usd',
      UserId: testUser.id
		});
	});

	after(() => {
		truncateTestDB();
	});

	it('should return unauthorized error', (done) => {
		let appData = {
      payment_type: 'btc'
		};
		request(url)
			.post(`${baseURL}/request`)
			.send(appData)
			.expect('Content-Type', /json/)
			.expect(401)
			.end((err, res) => {
				if (err)
					return done(err);

        res.body.message.should.equal('Invalid Token or Key');
        done();
			});
	});

  it('should return fields required error', (done) => {
		let paymentData = {
      note: 'Testing Payment Request'
		};
		request(url)
			.post(`${baseURL}/request`)
			.send(paymentData)
      .set('Api-Key', testApp.key)
			.expect('Content-Type', /json/)
			.expect(400)
			.end((err, res) => {
				if (err)
					return done(err);

        res.body.error.should.equal('All fields are required.');
        res.body.success.should.equal(false);
        done();
			});
	});

  it('should create new btc payment request', (done) => {
    let paymentData = {
      note: 'Testing Payment Request',
      payment_type: 'btc'
		};
		request(url)
			.post(`${baseURL}/request`)
			.send(paymentData)
      .set('Api-Key', testApp.key)
			.expect('Content-Type', /json/)
			.expect(200)
			.end((err, res) => {
				if (err)
					return done(err);

        res.body.payment_type.should.equal(paymentData.payment_type);
        done();
			});
	});

  it('should create new eth payment request', (done) => {
    let paymentData = {
      note: 'Testing Payment Request',
      payment_type: 'eth'
		};
		request(url)
			.post(`${baseURL}/request`)
			.send(paymentData)
      .set('Api-Key', testApp.key)
			.expect('Content-Type', /json/)
			.expect(200)
			.end((err, res) => {
				if (err)
					return done(err);

        res.body.payment_type.should.equal(paymentData.payment_type);
        done();
			});
	});

});
