import * as controllers from '../controllers';

export default (app) => {

    app.get('/api', controllers.api);

    app.post('/importCSV', controllers.importCSV);
}
