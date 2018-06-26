import Web3 from 'web3';
import dotenv from 'dotenv';
import {
    abi as TokenABI
} from '../abi/token.json';
import {
    abi as ConverterABI
} from '../abi/converter.json';
import request from 'request';

dotenv.config();

class MarketService {
    constructor(_opts) {
        this.opts = _opts;
        this.web3 = new Web3();
        this.web3.setProvider(new this.web3.providers.HttpProvider(`https://${this.opts.network}.infura.io/${this.opts.infuraKey}`));

        this.tokenBNTInstance = new this.web3.eth.Contract(TokenABI, this.opts.bntAddress);
        this.tokenPEGInstance = new this.web3.eth.Contract(TokenABI, this.opts.pegAddress);
        this.converterInstance = new this.web3.eth.Contract(ConverterABI, this.opts.converterAddress);
    }

    async getConnectorDepth() {
        let balance = await this.converterInstance.methods.getConnectorBalance(this.opts.bntAddress).call();
        return balance / 1e18;
    }

    async getPEGTotalSupply() {
        let total = await this.tokenPEGInstance.methods.totalSupply().call();
        return total / 1e18;
    }

    getBNTRate() {
        return new Promise((resolve, reject) => {
            try {
                let URL = 'https://min-api.cryptocompare.com/data/price?fsym=BNT&tsyms=USD,ETH';
                request.get(URL, (err, result) => {
                    if (err || result.statusCode !== 200) {
                        //TODO: do something on error details
                        reject(err || result);
                    } else {
                        let data = JSON.parse(result.body);
                        resolve(data);
                    }
                })
            } catch (e) {
                //TODO: do something on error details
                reject(e);
            }
        })
    }

    async details() {
        let depthBNT = await this.getConnectorDepth();
        let totalSupplyPEG = await this.getPEGTotalSupply();
        let rateBNT = await this.getBNTRate();
        let cap = (depthBNT / 0.07) * rateBNT.USD;
        let depthUSD = (depthBNT * rateBNT.USD);
        let marketCap = cap;
        let price = (cap / totalSupplyPEG);
        return {
            depthBNT: depthBNT,
            depthUSD: depthUSD,
            marketCap: marketCap,
            price: price
        };
    }
}

let marketService = new MarketService({
    network: (process.env.NODE_ENV == 'test' || process.env.NODE_ENV == 'development') ? 'ropsten' : 'mainnet',
    infuraKey: process.env.INFURA_ACCESS_KEY,
    bntAddress: process.env.BNT_ADDRESS,
    pegAddress: process.env.PEG_ADDRESS,
    converterAddress: process.env.CONVERTER_ADDRESS
});

export default {
    marketService: marketService,
    MarketService: MarketService
}