const { writeFileSync, mkdirSync } = require('fs');

require('dotenv').config();

// TARGET PATH TO CREATE ENV FILE
const targetPath = './src/environments/environment.ts';

// ENVIROMENT CONTENT
const envFileContent = `
  export const enviroment = {
    map_libre_key: "${ process.env['MAP_LIBRE_KEY'] }",
    custom: "IM CUSTOM",
  };
`;

// Make a directory and leave it if exist
mkdirSync('./src/environments', { recursive: true });

// Create file
writeFileSync( targetPath, envFileContent );
