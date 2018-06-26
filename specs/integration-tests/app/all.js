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

describe('app/all', () => {

  let url = server();
  let baseURL = '/api/v1/user';
  let userService = user.userService;
  let appService = app.appService;
  let userToken = null;
  let adminToken = null;
	let testUser = null;

  before(async() => {
		await truncateTestDB();
    let adminUser = await userService.register({
      email: 'user1@gmail.com',
      first_name: 'user1',
      last_name: 'user1',
      password: '123'
    });
    adminToken = await userService.generateToken(adminUser.id, 'user1@gmail.com', adminUser.uuid);
		await userService.update(adminUser.id, {role: 'admin'});

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
      UserId: testUser.id
		};

    let app = await appService.create(appData);

	});

	after(async () => {
		await truncateTestDB();
	});

	it('should return unauthorized error when without token', (done) => {
		request(url)
			.get(`${baseURL}/${testUser.id}/apps/10/1`)
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
			.get(`${baseURL}/${testUser.id}/apps/10/1`)
			.expect('Content-Type', /json/)
      .set('Token', userToken)
			.expect(401)
			.end((err, res) => {
				if (err)
					return done(err);

        res.body.message.should.equal('Not Authorized');
        done();
			});
	});

  it('should return correct data', (done) => {
		request(url)
			.get(`${baseURL}/${testUser.uuid}/apps/10/1`)
      .set('Token', adminToken)
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
