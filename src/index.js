import http from 'http';
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';
import compression from 'compression';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import controllersAPI_V1 from './api/v1';
import config from './config';
import dotenv from 'dotenv';
dotenv.config();

let rootPath = path.normalize(__dirname);
let staticPath = rootPath.replace('/app', '');

let app = express();
let server = http.createServer(app);

app.use(helmet());
app.use(morgan('dev'));

app.set('views', rootPath + '/views')
app.set('view engine', 'pug')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: true
}))
app.use(cookieParser())
app.use(compression());
app.use(express.static(staticPath + '/dist'))
app.use(methodOverride())

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Token, API-Key');
	if (req.method == 'OPTIONS') {
		res.status(200).end();
	} else {
		next();
	}
});
app.use(controllersAPI_V1(app));

server.listen(config.port);
console.log(`Started on port ${server.address().port}`);

export default app;
