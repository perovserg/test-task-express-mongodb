import express from 'express';

import middleware from './middleware';
import routes from './routes';

const port = process.env.EXPRESS_PORT || 3000;
const app = express();

middleware(app);
routes(app);


app.listen(port,undefined,undefined,() => console.log(`Express listening on port ${port}`));


