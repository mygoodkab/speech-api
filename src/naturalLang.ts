// Imports the Google Cloud client library
const language = require('@google-cloud/language');

const naturalLang = (text) => {

    // Instantiates a client
    const client = new language.LanguageServiceClient();

    const document = {
        content: text,
        type: 'PLAIN_TEXT',
    };


    // Detects the sentiment of the text

    return new Promise((resolve, reject) => {
        client
            .analyzeSentiment({ document: document })
            .then(results => {
                const sentiment = results[0].documentSentiment;
                console.log(`Text: ${text}`);
                console.log(`Sentiment score: ${sentiment.score}`);
                console.log(`Sentiment magnitude: ${sentiment.magnitude}`);
                resolve(results)

            })
            .catch(err => {
                console.error('ERROR:', err);
                reject(err)
            });
    })
}

export { naturalLang }