import models from '../../../src/models';
import config from '../../../src/config';
import chai from 'chai';
import {
	assert,
	expect
} from 'chai';
chai.should();

import {
	truncateTestDB
} from '../helper';
let model = models(config);

import user from '../../../src/services/user';

describe('services/user', () => {
  let userService = user.userService;
	let testUser = null;

	before(async () => {
		await truncateTestDB();
		testUser = await userService.register({
			email: 'testUser@gmail.com',
			first_name: 'testUser',
			last_name: 'testUser',
			password: '123'
		});
		let testUser2 = await userService.register({
			email: 'testUser2@gmail.com',
			first_name: 'testUser2',
			last_name: 'testUser2',
			password: '123'
		});
	});

	after(async () => {
		await truncateTestDB();
	});

  [
    'encryptPassword',
    'comparePassword',
    'getUser',
    'register',
    'deleteData',
    'emailExist',
    'getByID',
    'getByEmail',
    'update',
		'list',
		'login',
		'getUserToken',
		'updateUserToken',
		'generateToken'
  ].forEach(method => {
    it(`${method} should be a function`, () => {
			expect(userService[method]).to.be.a('function');
		});
  });

  describe('#register', () => {

		it('should return a Promise', () => {
			let userData = {
				first_name: 'Expected first name',
				last_name: 'Expected last name',
				email: 'email_test_user@gmail.com',
				password: '123'
			};
			let register = userService.register(userData);
			expect(register.then).to.be.a('function');
			expect(register.catch).to.be.a('function');
		})

		it('should return an error', () => {
			let userData = {
				first_name: 'Expected first name',
				last_name: 'Expected last name',
				email: 'email_test_user@gmail.com'
			};
			return userService.register(userData)
			.then(res => {})
			.catch(err => {
				expect(err).to.not.be.null;
			})
		})

		it('should save correct data', async () => {
			let userData = {
				first_name: 'Expected first name',
				last_name: 'Expected last name',
				password: '123'
			};
			let fields = ['first_name', 'last_name']

      let res = await userService.register(userData);
      expect(res).to.not.be.null;
      for (let i = 0; i < fields.length; i++) {
        expect(res.dataValues[fields[i]]).to.be.equal(userData[fields[i]]);
      }
		});

	});

  describe('#comparePassword', () => {

		it('should return a Promise', () => {
			let register = userService.comparePassword('password1', 'password2');
			expect(register.then).to.be.a('function');
			expect(register.catch).to.be.a('function');
		});

    it('should return false', async () => {
			let isPasswordMatch = await userService.comparePassword('password1', 'password2');
			expect(isPasswordMatch).to.be.false;
		});

    it('should return true', async () => {
      let passwordHash = await userService.encryptPassword('password1');
			let isPasswordMatch = await userService.comparePassword('password1', passwordHash);
			expect(isPasswordMatch).to.be.true;
		});

  });

  describe('#emailExist', () => {

		it('should return true', async () => {
      let userData = {
        email: 'first_user@gmail.com',
				first_name: 'Expected first name',
				last_name: 'Expected last name',
				password: '123'
			};
			let res = await userService.register(userData);
      let isEmailExist = await userService.emailExist(userData.email);
      expect(isEmailExist).to.be.true;
		});

		it('should return false', async () => {
      let isEmailExist = await userService.emailExist('randomuser@gmail.com');
      expect(isEmailExist).to.be.false;
		});

		it('should return a Promise', () => {
			let res = userService.emailExist('randomuser@gmail.com');
			expect(res.then).to.be.a('function');
			expect(res.catch).to.be.a('function');
		})

	});

  describe('#getByEmail', () => {

		it('should return a Promise', () => {
			let fields = ['first_name', 'last_name'];
			let res = userService.getByEmail('first_user@gmail.com', fields);
			expect(res.then).to.be.a('function');
			expect(res.catch).to.be.a('function');
		});

		it('should get correct data', async () => {
			let userData = {
				email: 'email-test@gmail.com',
				first_name: 'Expected first name',
				last_name: 'Expected last name',
				password: '123'
			};
			let fields = ['first_name', 'last_name', 'email']

      let res = await userService.register(userData);
			let userResult = await userService.getByEmail(userData.email, fields);

			expect(userResult).to.not.be.null;
			expect(Object.keys(userResult.dataValues).length).to.be.equal(fields.length);
			for (let i = 0; i < fields.length; i++) {
				expect(userResult.dataValues[fields[i]]).to.be.equal(userData[fields[i]]);
			}
		});

		it('should return no result', async () => {
      let res = await userService.getByEmail('123@gmail.com');
      expect(res).to.be.null;
		});

	});

	describe('#list', () => {

		it('should return a Promise', () => {
			let res = userService.list(10,1);
			expect(res.then).to.be.a('function');
			expect(res.catch).to.be.a('function');
		});

		it('should return correct data', async () => {
			let users = await model.User.findAndCountAll();
			let perPage = 10;
			let page = 1;
			let count = Math.min(perPage, users.count);
			let res = await userService.list(perPage, page);
			expect(res.data.length).to.be.equal(count);
		});

	});

	describe('#login', () => {

		it('should return a Promise', () => {
			let res = userService.login('testUser2@gmail.com', '123');
			expect(res.then).to.be.a('function');
			expect(res.catch).to.be.a('function');
		});

		it('should return incorrect combination', (done) => {
			userService.login('testUser@gmail.com', '123')
			.then(res => {done();})
			.catch(err => {
				console.log(err)
				expect(err).to.not.be.null;
				done();
			})
		});

		it('should login user', async () => {
			let user = await userService.login('testUser@gmail.com', '123');
			expect(user.userId).to.be.equal(testUser.uuid);
			expect(user.message).to.be.equal('Token generated');
			expect(user.success).to.be.true;
		});

	});

});
