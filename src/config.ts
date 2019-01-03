
import * as pathSep from 'path';
module.exports = {
    dev: {
        mongodb: {
            url: 'mongodb://good:good1234@ds041177.mlab.com:41177/speech-to-text',
            decorate: true,
            settings: {
                poolSize: 10,
            },
        },
        path: {
            upload: pathSep.join(__dirname, 'uploads'),
            pdf: pathSep.join(__dirname, 'uploads', 'document.pdf'),
        },
        hapi: {
            host: '127.0.0.1',
            port: '3000',
            router: { routes: 'dist/routes/*.js' },
        },
        jwt: {
            timeout: '8h',
            refreshInterval: 30 * 60 * 1000 // 30 mins
        },
        regex: /[\S]+/,
    }
};
