import config from '../../src/config';
import models from '../../src/models';
import randomstring from 'randomstring';
import moment from 'moment';
import _ from 'lodash';

let model = models(config);

let tables = [
  'BitcoinAddress',
  'EthAddress',
  'PaymentAddress',
  'PaymentDetails',
  'Payment',
  'Token',
  'App',
  'User',
];

export function xPubKeys() {
  return {
    btc_xpubkey: 'tpubD6NzVbkrYhZ4YahP3U1iX4VwM6WH2gkY7a2Q5j33ET4rsSsbUZaJrhvm3Pg1EsSXSBUEG3YXZqGDxdQdJkZdDw6nynAGHs8Cfuh42EoYahd',
    eth_xpubkey: 'xpub6F3UDWWniqSUcfPied5SPqhBTFuYwAS2dGPQo1Sjpen4tDN1p4cdwGQAEQRjjvpZViBs8Du6uW2YXgirbGxo8avtX54WLWwFRZnAqAj9WyH'
  }
}

export function server() {
  return 'http://localhost:3000';
}

export function modelNames () {
  return tables;
};

export function truncateTestDB () {
  _.forEach(tables, table => {
      model[table].destroy({
			where: {},
		});
  });
};
