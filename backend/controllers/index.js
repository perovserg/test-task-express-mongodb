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

    return res.json({message: 'import is started!'});
};


export const usedForms = async (req, res) => {


    const maxTimeDoc = await StatisticsModel.find().sort( { ts: -1 } ).limit(1);

    const maxTime = op.get(maxTimeDoc, '0._doc.ts');

    if (!maxTime) throw new Error(`couldn't find max time document`);

    const timeForFilter = new Date();
    timeForFilter.setTime(maxTime.getTime() - (1*60*60*1000));


    const documents = await StatisticsModel.find({ ts: { $gt: timeForFilter } }).sort( { ts: -1 } ).select('ssoid formid ts');

    const result = documents.map(doc => {
        return {
            ssoid: op.get(doc, '_doc.ssoid'),
            formid: op.get(doc, '_doc.formid'),
            ts: moment(op.get(doc, '_doc.ts')).format("DD-MM-YYYY HH:mm:ss") ,
        }
    });

    return res.json({
        success: true,
        result: result
    });
};


export const unfinishedForms = async (req, res) => {


    const allStarts = await StatisticsModel.find({ grp: /^dszn_/, subtype: 'start' });

    const unfinishedActions = [];

    for (const doc of allStarts) {

        const lastAction = await StatisticsModel.find({ ssoid: op.get(doc, '_doc.ssoid'), ymdh: op.get(doc, '_doc.ymdh')}).sort({ ts: -1 }).limit(1);

        if (op.get(lastAction, '0._doc.subtype') !== 'send') {
            unfinishedActions.push(Object.assign(op.get(lastAction, '0._doc'), {
                timeStart: moment(op.get(doc, '_doc.ts')).format("DD-MM-YYYY HH:mm:ss"),
                timeStop: moment(op.get(lastAction, '0._doc.ts')).format("DD-MM-YYYY HH:mm:ss")
            }));
        }

    }

    return res.json({
        success: true,
        result: unfinishedActions
    });
};


export const top5 = async (req, res) => {


    const top5 = await StatisticsModel.aggregate([{$group: {_id: "$formid", n:{$sum: 1}}}]).sort({n: -1}).limit(5);


    return res.json({
        success: true,
        result: top5
    });
};
