
import * as  Boom from 'boom';
import * as Joi from 'joi';
import { ObjectId } from 'mongodb';
import { Util } from '../util';
import * as fs from 'fs';
import { convertToText } from '../recognition';
import { convertToSpeech } from '../textToSpeech';
import { server, config } from '../index';
import { analyzeEntities, analyzeSentiment, analyzeSyntax, analyzeEntitySentiment } from '../naturalLang';
const fileName = './src/resources/audio.raw';
// const speech = require('@google-cloud/speech');
const mongoObjectId = ObjectId;
module.exports = [
    {  // GET content
        method: 'GET',
        path: '/speech',
        config: {
            auth: false,
            description: 'Get content',
            tags: ['api'],
        }, handler: async (req, reply) => {
            try {
                const db = Util.getDb(req);
                const params = req.params;

                // Reads a local audio file and converts it to base64
                const file = fs.readFileSync(fileName);
                const audioBytes = file.toString('base64');

                // The audio file's encoding, sample rate in hertz, and BCP-47 language code
                const audio = {
                    content: audioBytes,
                };

                const config = {
                    encoding: 'LINEAR16',
                    sampleRateHertz: 16000,
                    languageCode: 'en-US',
                };

                const text = await convertToText(audio, config);
                const update = await db.collection('wakeup').updateOne({ key: 0 }, { $set: { wakeup: true, word: text } })

                return {
                    statusCode: 200,
                    message: 'OK',
                    data: text
                };

            } catch (error) {
                return (Boom.badGateway(error));
            }
        },

    },
    {  // POST Audio
        method: 'POST',
        path: '/speech/base64',
        config: {
            auth: false,
            description: 'Get content',
            tags: ['api'],
            validate: {
                payload: {
                    audio: Joi.any().optional().description('audio to base64'),
                },
            },
        }, handler: async (req, reply) => {
            try {
                const db = Util.getDb(req);
                const payload = req.payload;
                // The audio file's encoding, sample rate in hertz, and BCP-47 language code
                const audio = {
                    content: payload.audio,
                };

                const config = {
                    encoding: 'LINEAR16',
                    sampleRateHertz: 44100,
                    languageCode: 'en-US',
                };

                const text = await convertToText(audio, config);
                const update = await db.collection('wakeup').updateOne({ key: 0 }, { $set: { wakeup: true, word: text } })

                return {
                    statusCode: 200,
                    message: 'OK',
                    data: text
                };

            } catch (error) {
                return (Boom.badGateway(error));
            }
        },

    },
    {  // POST Audio && Return sound buffer
        method: 'POST',
        path: '/speech/audio',
        config: {
            auth: false,
            description: 'Get content',
            tags: ['api'],
            validate: {
                payload: {
                    audio: Joi.any().optional().description('audio to base64'),
                },
            },
        }, handler: async (req, reply) => {
            try {
                const db = Util.getDb(req);
                const payload = req.payload;
                // The audio file's encoding, sample rate in hertz, and BCP-47 language code
                const audio = {
                    content: payload.audio,
                };

                const config = {
                    encoding: 'LINEAR16',
                    sampleRateHertz: 44100,
                    languageCode: 'en-US',
                };

                // get text speech 
                const text = await convertToText(audio, config);

                // Construct the request
                const request = {
                    input: { text: text },
                    // Select the language and SSML Voice Gender (optional)
                    voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
                    // Select the type of audio encoding
                    audioConfig: { audioEncoding: 'MP3' },
                };

                const speech = await convertToSpeech(request);
                const update = await db.collection('wakeup').updateOne({ key: 0 }, { $set: { wakeup: true } })
                return {
                    statusCode: 200,
                    message: 'OK!',
                    data: {
                        speech,
                        text
                    }
                };

            } catch (error) {
                return (Boom.badGateway(error));
            }
        }
    },
    {  // GET wakeup/mqtt
        method: 'GET',
        path: '/wakeup/mqtt',
        config: {
            auth: false,
            description: 'Get content',
            tags: ['api'],

        }, handler: async (req, reply) => {
            try {
                const mqttClient = server.plugins['hapi-mqtt'].client;
                const params = req.params;
                const pub = await mqttClient.publish('/mirror/wakeup', 'mirror mirror on the wall');
                return {
                    statusCode: 200,
                    message: 'OK',

                };

            } catch (error) {
                return (Boom.badGateway(error));
            }
        },

    },
    {  // GET wakeup database
        method: 'GET',
        path: '/wakeup/database',
        config: {
            auth: false,
            description: 'Get wakeup database',
            tags: ['api'],

        }, handler: async (req, reply) => {
            try {
                const db = Util.getDb(req);
                const res = await db.collection('wakeup').findOne({ key: 0 });
                if (!res) {
                    const insert = await db.collection('wakeup').insertOne({ wakeup: false, key: 0 });
                    return {
                        statusCode: 200,
                        message: 'OK',
                        data: false,
                    };
                }

                return {
                    statusCode: 200,
                    message: res.word,
                    data: res.wakeup,
                };

            } catch (error) {
                return (Boom.badGateway(error));
            }
        },

    },
    {  // GET update wakeup to false database
        method: 'GET',
        path: '/wakeup/sleep',
        config: {
            auth: false,
            description: 'Get wakeup database',
            tags: ['api'],

        }, handler: async (req, reply) => {
            try {
                const db = Util.getDb(req);
                const update = await db.collection('wakeup').updateOne({ key: 0 }, { $set: { wakeup: false, word: 'waiting . . .' } });

                return {
                    statusCode: 200,
                    message: 'OK',
                };

            } catch (error) {
                return (Boom.badGateway(error));
            }
        },

    },
    {  // GET update wakeup to true database
        method: 'GET',
        path: '/wakeup/up',
        config: {
            auth: false,
            description: 'Get wakeup database',
            tags: ['api'],

        }, handler: async (req, reply) => {
            try {
                const db = Util.getDb(req);
                const update = await db.collection('wakeup').updateOne({ key: 0 }, { $set: { wakeup: true, word: 'TEST from API' } });

                return {
                    statusCode: 200,
                    message: 'OK',
                };

            } catch (error) {
                return (Boom.badGateway(error));
            }
        },

    },
    {  // POST Natural Language Analyzing entities
        method: 'POST',
        path: '/naturalLang/entities',
        config: {
            auth: false,
            description: 'Get Natural Language Analyzing entities',
            tags: ['api'],
            validate: {
                payload: {
                    text: Joi.string().required()
                }
            }
        }, handler: async (req, reply) => {
            try {
                const payload = req.payload;
                const resNaturalLang = await analyzeEntities(payload.text);
                return {
                    statusCode: 200,
                    msg: 'OK',
                    data: resNaturalLang
                }
            } catch (error) {
                return Boom.badGateway(error)
            }
        }
    },
    {  // POST Natural Language Analyzing Sentiment
        method: 'POST',
        path: '/naturalLang/sentiment',
        config: {
            auth: false,
            description: 'Get Natural Language Analyzing Sentiment',
            tags: ['api'],
            validate: {
                payload: {
                    text: Joi.string().required()
                }
            }
        }, handler: async (req, reply) => {
            try {
                const payload = req.payload;
                const resNaturalLang = await analyzeSentiment(payload.text);
                return {
                    statusCode: 200,
                    msg: 'OK',
                    data: resNaturalLang
                }
            } catch (error) {
                return Boom.badGateway(error)
            }
        }
    },
    {  // POST Natural Language Analyzing Syntax
        method: 'POST',
        path: '/naturalLang/syntax',
        config: {
            auth: false,
            description: 'Get Natural Language Analyzing Syntax',
            tags: ['api'],
            validate: {
                payload: {
                    text: Joi.string().required()
                }
            }
        }, handler: async (req, reply) => {
            try {
                const payload = req.payload;
                const resNaturalLang = await analyzeSyntax(payload.text);
                return {
                    statusCode: 200,
                    msg: 'OK',
                    data: resNaturalLang
                }
            } catch (error) {
                return Boom.badGateway(error)
            }
        }
    },
    {  // POST Natural Language Entity Sentiment
        method: 'POST',
        path: '/naturalLang/entitySentiment',
        config: {
            auth: false,
            description: 'Get Natural Language Analyzing Syntax',
            tags: ['api'],
            validate: {
                payload: {
                    text: Joi.string().required()
                }
            }
        }, handler: async (req, reply) => {
            try {
                const payload = req.payload;
                const resNaturalLang = await analyzeEntitySentiment(payload.text);
                return {
                    statusCode: 200,
                    msg: 'OK',
                    data: resNaturalLang
                }
            } catch (error) {
                return Boom.badGateway(error)
            }
        }
    },
]