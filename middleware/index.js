import op from 'object-path';


export default (app) => {

    app.use((req, res, next) => {
        const method = op.get(req, 'method'),
            url = op.get(req, 'url');
        console.log(`<= Incoming request => [${method}] ${url}`);
        next();
    });

}
