# Functional Testing Starter Kit
Using Intern, CircleCI, and Gulp

## Requirements

- Node.js 0.12.x

## Getting Started

- `npm install` to grab the project's dependencies
- `npm run server` to see the front end at `localhost:3000` in your browser

## Local Testing

Functional tests are run locally using ChromeDriver. `npm run tests:functional` to kick them off.

### Debugging

#### Front End

By default, ChromeDriver will quit once the tests have run, but if you want to leave it open for debugging, set `leaveRemoteOpen` (inside `intern.development.js`) to `true`.

#### Intern

You can debug your tests themselves by running `npm run tests:functional:debug`, which will launch a [Node Inspector](https://github.com/node-inspector/node-inspector) debugger in Chrome. The Debugger works almost exactly like Chrome Developer Tools.