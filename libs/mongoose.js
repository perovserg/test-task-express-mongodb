import mongoose from 'mongoose';
import {URL} from 'url';

import log from './log';


const mongoURL = new URL(`mongodb://${process.env.MONGODB_URL}`);
mongoURL.port = process.env.MONGODB_PORT;
mongoURL.username = process.env.MONGODB_USER;
mongoURL.password = process.env.MONGODB_PASS;
mongoURL.pathname = process.env.MONGODB_DATABASE;
mongoURL.search = process.env.MONGODB_DATABASE_USER;

mongoose.connect(mongoURL.href, {useNewUrlParser: true});

const db = mongoose.connection;

db.on('error', (err) => {
    log.error('connection error:', err.message);
});
db.once('open', () => {
    log.info(`Connected to DB on url: ${mongoURL.href}`);
});

const Schema = mongoose.Schema;

// Schemas

const Statistics = new Schema({
    ssoid:          { type: String },
    ts:             { type: Date, required: true },
    grp:            { type: String, required: true },
    type:           { type: String, required: true },
    subtype:        { type: String },
    url:            { type: String },
    orgid:          { type: String },
    formid:         { type: String },
    code:           { type: String },
    ltpa:           { type: String },
    sudirresponse:  { type: String },
    ymdh:           { type: Date, required: true }

});

export const StatisticsModel = mongoose.model('Statistics', Statistics);
