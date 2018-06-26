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

describe('auth/login', () => {

  let url = server();
  let baseURL = '/api/v1/auth';
  let userService = user.userService;

  before(async() => {
		truncateTestDB();
    let res = await userService.register({
      email: 'user1@gmail.com',
      first_name: 'user1',
      last_name: 'user1',
      password: '123'
    });
	});

	after(() => {
		truncateTestDB();
	});

	it('should return fields required error', (done) => {
		let data = {
			email: 'test@gmail.com'
		};
		request(url)
			.post(baseURL + '/login')
			.send(data)
			.expect('Content-Type', /json/)
			.expect(400)
			.end((err, res) => {
				if (err)
					return done(err);

				res.status.should.equal(400);
        res.body.error.should.equal('All fields are required.');
				res.body.success.should.equal(false);
        done();
			});
	});

  it('should return incorrect combination error', (done) => {
		let data = {
			email: 'test@gmail.com',
      password: '123'
		};
		request(url)
			.post(`${baseURL}/login`)
			.send(data)
			.expect('Content-Type', /json/)
			.expect(400)
			.end((err, res) => {
				if (err)
					return done(err);

				res.status.should.equal(400);
        res.body.error.should.equal('Incorrect email and password combination');
				res.body.success.should.equal(false);
        done();
			});
	});

  it('should return token and user info', (done) => {
    request(url)
			.post(`${baseURL}/login`)
			.send({
        email: 'user1@gmail.com',
        first_name: 'user1',
        last_name: 'user1',
        password: '123'
      })
			.expect('Content-Type', /json/)
			.expect(200)
			.end((err, res) => {
        if (err)
					return done(err);

				res.status.should.equal(200);
        res.body.message.should.equal('Token generated');
				res.body.success.should.equal(true);
        done();
			});
	});

});
