import cors from 'cors';
import bodyParser from 'body-parser';
import op from 'object-path';

import log from '../libs/log';


export default (app) => {

    app.use(async (req, res, next) => {
        try {
            await next();
        } catch (err) {
            res.statusCode = err.status || 500;
            log.error('Internal error(%d): %s', res.statusCode, err.message);
            res.send({ error: err.message });
        }
    });

    app.use((req, res, next) => {
        const method = op.get(req, 'method'),
            url = op.get(req, 'url');
        log.info(`<= Incoming request => [${method}] ${url}`);
        next();
    });

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    app.use(cors({
        'allowedHeaders': ['sessionId', 'Content-Type'],
        'exposedHeaders': ['sessionId'],
        'origin': '*',
        'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
        'preflightContinue': false
    }));

}
