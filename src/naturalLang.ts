// Imports the Google Cloud client library
const language = require('@google-cloud/language');


// Instantiates a client
const client = new language.LanguageServiceClient();

const analyzeEntities = async (text) => {
    const document = {
        content: text,
        type: 'PLAIN_TEXT',
    };

    // Analyzing Entitiment 
    const [result] = await client.analyzeEntities({ document });
    return result
}

const analyzeSentiment = async (text) => {

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

const analyzeSyntax = async (text) => {

    const document = {
        content: text,
        type: 'PLAIN_TEXT',
    };


    // Detects syntax in the document
    return new Promise((resolve, reject) => {
        client
            .analyzeSyntax({ document: document })
            .then(results => {
                const syntax = results[0].documentSentiment;
                resolve(results)

            })
            .catch(err => {
                console.error('ERROR:', err);
                reject(err)
            });
    })

}

const analyzeEntitySentiment = async (text) => {

    const document = {
        content: text,
        type: 'PLAIN_TEXT',
    };


    // Detects syntax in the document
    return new Promise((resolve, reject) => {
        client
            .analyzeEntitySentiment({ document: document })
            .then(results => {
                const entitySentiment = results[0].documentSentiment;
                resolve(results)

            })
            .catch(err => {
                console.error('ERROR:', err);
                reject(err)
            });
    })

}

export { analyzeEntities, analyzeSentiment, analyzeSyntax, analyzeEntitySentiment }