# Bonita portal js

Part of bonita portal written using AngularJs

## Requirements
- node.js > 4.2.0 + npm
- maven > 3.0.5

## Development tasks
Please run `npm install` Before launching any of following tasks

### Launch project in development mode
Before running project in development mode, you need to launch a Bonita BPM backend available on URL http://localhost:8080/
Then launch:

    npm run dev
    
Project should be running at URL http://localhost:9000/bonita/portaljs/
    
### Launch unit tests
    npm run test

### Launch unit tests in watch mode
    npm run test:watch
    
### Launch end to end tests
    npm run e2e

### Build project
    npm run build

### Localization
Localization keys can be extracted from source files to an .pot output file (./target/portal-js.pot). To do so, run the following command

    npm run pot
    
## Maven build
Project can also be built using maven

    mvn clean package [-Pe2e]

This will build the project, package it in a zip file and, run end to end test if _e2e_ profile is activated
