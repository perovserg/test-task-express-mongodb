import op from 'object-path';

export const api = (req, res) => {
    res.send(`API is running... uptime: ${process.uptime()} sec.`);
};

export const importCSV = async (req, res) => {
    console.log('import CSV is started...');

    const url = op.get(req, 'body.url');
    if (!url) throw new Error('Got no argument "url"');

    res.send('import!');
};
