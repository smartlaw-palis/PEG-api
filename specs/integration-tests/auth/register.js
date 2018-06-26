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

describe('auth/register', () => {

  let url = server();
  let baseURL = '/api/v1/auth';
  let userService = user.userService;

  before(async() => {
		truncateTestDB();
		let res = await userService.register({
      email: 'test@gmail.com',
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
			.post(`${baseURL}/register`)
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

	it('should return invalid email error', (done) => {
		let data = {
			first_name: 'user1',
			last_name: 'user1',
			email: 'test',
			password: '123',
      confirm_password: '123'
		};
		request(url)
			.post(`${baseURL}/register`)
			.send(data)
			.expect('Content-Type', /json/)
			.expect(400)
			.end((err, res) => {
				if (err)
					return done(err);

				res.status.should.equal(400);
				res.body.error.should.equal('Invalid email.');
				res.body.success.should.equal(false);
        done();
			});
	});

	it('should return email exist error', (done) => {
		let data = {
			first_name: 'user1',
			last_name: 'user1',
			email: 'test@gmail.com',
      password: '123',
			confirm_password: '123'
		};
		request(url)
			.post(`${baseURL}/register`)
			.send(data)
			.expect('Content-Type', /json/)
			.expect(400)
			.end((err, res) => {
				if (err)
					return done(err);

				res.status.should.equal(400);
				res.body.error.should.equal('Email already exist.');
				res.body.success.should.equal(false);
        done();
			});
	});

	it('should register user', (done) => {
		let data = {
			first_name: 'user1',
			last_name: 'user1',
			email: 'test143@gmail.com',
      password: '123',
			confirm_password: '123'
		};
		request(url)
			.post(`${baseURL}/register`)
			.send(data)
			.expect('Content-Type', /json/)
			.expect(200)
			.end((err, res) => {
				if (err)
					return done(err);

				res.status.should.equal(200);
				res.body.success.should.equal(true);
        done();
			});
	});

});
