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

describe('app/new-app', () => {

  let url = server();
  let baseURL = '/api/v1/app';
  let userService = user.userService;
  let userToken = null;
  let testUser = null;

  before(async() => {
		truncateTestDB();
    testUser = await userService.register({
      email: 'user1@gmail.com',
      first_name: 'user1',
      last_name: 'user1',
      password: '123'
    });
    userToken = await userService.generateToken(testUser.id, 'user1@gmail.com', testUser.uuid);
	});

	after(() => {
		truncateTestDB();
	});

	it('should return unauthorized error', (done) => {
		let appData = {
			name: 'Testing App',
      btc_xpubkey: 'testing btc xpubkey',
      eth_xpubkey: 'testing etg xpubkey',
		};
		request(url)
			.post(`${baseURL}/new`)
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
		let appData = {
      name: 'Testing App'
		};
		request(url)
			.post(`${baseURL}/new`)
			.send(appData)
      .set('Token', userToken)
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

  it('should create new app', (done) => {
		let appData = {
			name: 'Testing App',
      btc_xpubkey: 'testing btc xpubkey',
      eth_xpubkey: 'testing etg xpubkey',
			token_price: 0.1,
			unit_price: 'usd'
		};
		request(url)
			.post(`${baseURL}/new`)
			.send(appData)
      .set('Token', userToken)
			.expect('Content-Type', /json/)
			.expect(200)
			.end((err, res) => {
				if (err)
					return done(err);

        res.body.success.should.equal(true);
        res.body.message.should.equal('App was created successfully');
        done();
			});
	});

});
