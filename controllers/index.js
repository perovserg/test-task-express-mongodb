import op from 'object-path';
import request from 'request';
import csvParser from 'csv-parser';
import moment from 'moment';

import log from '../libs/log';
import {StatisticsModel} from '../libs/mongoose';

export const api = (req, res) => {
    res.send(`API is running... uptime: ${process.uptime()} sec.`);
};

const saveStatItem = (data) => {

    StatisticsModel.create({
        ssoid:          op.get(data, 'ssoid'),
        ts:             moment.unix(parseInt(op.get(data, 'ts'), 10)).toDate(),
        grp:            op.get(data, 'grp'),
        type:           op.get(data, 'type'),
        subtype:        op.get(data, 'subtype'),
        url:            op.get(data, 'url'),
        orgid:          op.get(data, 'orgid'),
        formid:         op.get(data, 'formid'),
        code:           op.get(data, 'code'),
        ltpa:           op.get(data, 'ltpa'),
        sudirresponse:  op.get(data, 'sudirresponse'),
        ymdh:           moment(op.get(data, 'ymdh'), 'YYYY-MM-DD-HH').toDate()
    }, (err) => {
        if (err) {
            log.error(`< ==== ERROR ==== >`);
            log.error(`creating stat item error: ${err}`);
            log.error(`data: ${JSON.stringify(data)}`);
        }
    });

};

export const importCSV = (req, res) => {
    log.info('import CSV is started...');

    const url = op.get(req, 'body.url');
    if (!url) throw new Error('Got no argument "url"');

    request({url})
        .pipe(csvParser({ separator: ';' })
        .on('data',  saveStatItem)
        .on('end', () => log.info('import stage: parsing is completed'))
        );

    res.send('import is started!');
};
