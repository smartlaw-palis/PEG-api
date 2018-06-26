import chai from 'chai';
import {
	assert,
	expect
} from 'chai';
chai.should();

import {
	currentRate
} from '../../../src/controllers/helper';

describe('controllers/helper', () => {
  it('should return btc rate', (done) => {
    setTimeout(() => {
      currentRate('btc')
      .then(rate => {
        expect(rate).to.be.above(0);
        done();
      })
    }, 5000);
  });
	it('should return eth rate', (done) => {
    setTimeout(() => {
      currentRate('eth')
      .then(rate => {
        expect(rate).to.be.above(0);
        done();
      })
    }, 5000);
  });
});
