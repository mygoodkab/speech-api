const fs = require('fs');

// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');

// Creates a client
const client = new textToSpeech.TextToSpeechClient();

const convertToSpeech = (option: Option) => {
    return new Promise((resolve, reject) => {
        // Performs the Text-to-Speech request
        client.synthesizeSpeech(option, (err, response) => {
            if (err) {
                console.error('ERROR:', err);
                reject(err)
            }

            // console.log('reply audioContent : ', response.audioContent)
            resolve(response.audioContent)
            
            // Write the binary audio content to a local file
            // fs.writeFile('output.mp3', response.audioContent, 'binary', err => {
            //     if (err) {
            //         console.error('ERROR:', err);
            //         reject(err)
            //     }
            //     console.log('Audio content written to file: output.mp3');
            // });
        });
    })

}
export { convertToSpeech }

interface Option {
    input: object;
    voice: object;
    audioConfig: object;
}