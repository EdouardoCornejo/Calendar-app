const { require } = require('commonjs');
import jest from 'jest';
import process from 'process';

// yarn add -D whatwg-fetch
// import 'whatwg-fetch'; 

// yarn add -D setimmediate
// import 'setimmediate';


// yarn add -D dotenv
require('dotenv').config({
    path: '.env.test'
});

jest.mock('./src/helpers/getEnvVariables', () => ({
    getEnvVariables: () => ({ ...process.env })
}));