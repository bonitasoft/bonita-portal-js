# Bonita portal js

Part of bonita portal written using AngularJs

## Requirements
- node.js > v6.9.4 
- yarn > v0.27.5
- maven > 3.3.9

## Development tasks
Please run `yarn install` Before launching any of following tasks

### Launch project in development mode
Before running project in development mode, you need to launch a Bonita backend available on URL http://localhost:8080/
Then launch:

    yarn start
    
Project should be running at URL http://localhost:9000/bonita/portaljs/
    
### Launch unit tests
    yarn run test

### Launch unit tests in watch mode
    yarn run test:watch
    
### Launch end to end tests
    yarn run e2e
    
You can run specific e2e class test with this command line.

    yarn run e2eOnly --specs=path_to_file.e2e.js

### Launch end to end tests in headless mode
    yarn run e2e:headless

### Launch end to end tests in headless mode
    yarn run e2e:headless

### Build project
    yarn run build

### Localization
Localization keys can be extracted from source files to an .pot output file (./target/portal-js.pot). To do so, run the following command

    yarn run pot
    
## Maven build
Project can also be built using maven

    mvn clean package [-Pe2e]

This will build the project, package it in a zip file and, run end to end test if _e2e_ profile is activated
