import * as speech from '@google-cloud/speech';

const convertToText = (audio, config) => {

    // Creates a client
    const client = new speech.SpeechClient({
        keyFilename:'./GOOGLE_APPLICATION_CREDENTIALS.json'
    });

    const request = {
        audio: audio,
        config: config,
    };

    return new Promise((resolve, reject) => {
        client
            .recognize(request)
            .then(data => {
                const response = data[0];
                const transcription = response.results
                    .map(result => result.alternatives[0].transcript)
                    .join('\n');
                // console.log(`Transcription: ${transcription}`);
                resolve(transcription)
            })
            .catch(err => {
                console.error('ERROR:', err);
                reject(err)
            });
    })
}

export { convertToText }