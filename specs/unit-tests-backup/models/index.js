
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
	modelNames
} from '../helper';

describe('models/index', () => {
  let model = models(config);
	let arrModels = modelNames();

	before( async () => {
		await truncateTestDB();
	});

	after(async () => {
		await truncateTestDB();
	});

	arrModels.forEach(name => {
		it(`returns the ${name} model`, () => {
	    expect(model[name]).to.exist;
	  });
	});

	arrModels.forEach(name => {
		describe(`${name} model methods should exist`, () => {

			[
				'findOne',
				'create',
				'find',
				'destroy',
				'update'
			].forEach(method => {
				it(`${method} should be a function`, () => {
					expect(model[name][method]).to.exist;
			    expect(model[name][method]).to.be.a('function');
				});
		  });

		});
	});

});
