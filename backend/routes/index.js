import * as controllers from '../controllers';

export default (app) => {

    app.get('/api', controllers.api);

    app.post('/importCSV', controllers.importCSV);

    app.get('/usedForms', controllers.usedForms);

    app.get('/unfinishedForms', controllers.unfinishedForms);

    app.get('/top5', controllers.top5);

}
