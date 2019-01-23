import express from 'express';
import 'express-async-errors';

import middleware from './middleware';
import routes from './routes';
import log from './libs/log';

const port = process.env.API_PORT || 3000;
const app = express();

middleware(app);
routes(app);

app.use((req, res) => {
    res.status(404);
    log.debug('Not found URL: %s',req.url);
    res.send({ error: 'Not found' });
});


app.listen(port,undefined,undefined,() => log.info(`Express listening on port ${port}`));


