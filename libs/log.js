import winston from 'winston';
import moment from 'moment';

moment.locale(process.env.API_LOCALE);

export default winston.createLogger({
    level: 'debug',
    format: winston.format.printf(info => `[${moment().format('L LTS')}] ${info.level}: ${info.message}`),
    transports: [new winston.transports.Console()]
});


