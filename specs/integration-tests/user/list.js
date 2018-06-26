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


async function createUsers() {
	let userService = user.userService;
	for(let i=0; i<100; i++) {
		console.log(`creating user ${i}`);
		let testUser = await userService.register({
			email: `user143${i}@gmail.com`,
			first_name: 'user143',
			last_name: 'user143',
			role: 'admin',
			password: '123',
			confirm_password: '123'
		});
		let userToken = await userService.generateToken(testUser.id, `user143${i}@gmail.com`, testUser.uuid);
	}
}

describe('user/list', () => {

  let url = server();
  let baseURL = '/api/v1/users';
  let userService = user.userService;
  let userToken = null;
  let testUser = null;

  before(async() => {
		await truncateTestDB();
    //await createUsers();

		testUser = await userService.register({
      email: 'user143@gmail.com',
      first_name: 'user143',
      last_name: 'user143',
      role: 'admin',
      password: '123',
			confirm_password: '123'
    });
    userToken = await userService.generateToken(testUser.id, 'user143@gmail.com', testUser.uuid);
		await userService.update(testUser.id, {role: 'admin'});
	});

	after(async () => {
		await truncateTestDB();
	});

	it('should return unauthorized error when without token', (done) => {
		request(url)
			.get(`${baseURL}/10/1`)
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
      .set('Token', '12345')
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
