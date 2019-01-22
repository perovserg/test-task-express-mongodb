import * as controllers from '../controllers';

export default (app) => {
    // respond with "hello world" when a GET request is made to the homepage
    app.get('/', (req, res) => {
        res.send('hello world');
    });

    app.post('/importCSV', controllers.importCSV);
}
