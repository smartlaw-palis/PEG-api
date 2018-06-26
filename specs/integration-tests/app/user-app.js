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

describe('app/user-app', () => {

  let url = server();
  let baseURL = '/api/v1/apps';
  let userService = user.userService;
  let appService = app.appService;
  let userToken = null;
	let testUser = null;

  before(async() => {
		await truncateTestDB();
    testUser = await userService.register({
      email: 'user2@gmail.com',
      first_name: 'user2',
      last_name: 'user2',
      password: '123'
    });
    userToken = await userService.generateToken(testUser.id, 'user2@gmail.com', testUser.uuid);

    let appData = {
			name: 'Testing App',
      btc_xpubkey: 'testing btc xpubkey',
      eth_xpubkey: 'testing etg xpubkey',
			token_price: 0.1,
			unit_price: 'eth',
      UserId: testUser.id
		};

    let app = await appService.create(appData);

	});

	after(async () => {
		await truncateTestDB();
	});

	it('should return unauthorized error when without token', (done) => {
		request(url)
			.get(`${baseURL}/l0/1`)
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
			.get(`${baseURL}/10/1`)
			.expect('Content-Type', /json/)
      .set('Token', '123')
			.expect(401)
			.end((err, res) => {
				if (err)
					return done(err);

        res.body.message.should.equal('Invalid Token or Key');
        done();
			});
	});

  it('should return correct data', (done) => {
		request(url)
			.get(`${baseURL}/10/1`)
      .set('Token', userToken)
			.expect('Content-Type', /json/)
			.expect(200)
			.end((err, res) => {
				if (err)
					return done(err);

        res.body.data.length.should.equal(1);
        res.body.perPage.should.equal(10);
        res.body.pages.should.equal(1);
        res.body.page.should.equal(1);
        done();
			});
	});

});
