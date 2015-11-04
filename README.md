# Functional Testing Starter Kit
Using Intern, CircleCI, Gulp, and BrowserStack

## Requirements

- Node.js 0.12.x

## Getting Started

- `npm install` to grab the project's dependencies
- `npm run server` to see the front end at `localhost:3000` in your browser

### A Note About Workflow

By all means, no workflows are perfect, and you should feel free to tailor the code here for any style you like. The default setup is geared toward my own preferences, and is rather opinionated as a result. Absolutely no need to take it as gospel (though, it is starting to feel like something reasonable after years of dead ends).

Drawing on the [GitHub Flow](https://guides.github.com/introduction/flow/) model, it uses branches and Pull Requests to manage the development process around the loose concept of "features". The thing you're working on fixing/adding/updating is your "feature", and you track it by cutting a stable branch from your remote (GitHub in this case), and naming it after that feature. 

When you want to merge your feature branch into say, a production environment, you would submit a Pull Request against a special branch used only for production (in this case, `master`). The idea is that code isn't committed directly to these special environment branches, because they represent the code that is currently deployed to that environment at any given time. So anything in the `master` branch on GitHub should be considered safe to deploy, anytime, and should reflect the code that's currently running on the production server.

We keep this enforced by never deploying the code to these environments by hand. Rather, our Continous Integration server ([CircleCI](https://circleci.com/) in our case), handles that automatically. On every push it will build our app, run our tests, and if an environment branch is involved, it will deploy our app once everything has passed.

I keep two environment branches: `next` and `master`. `master` is my production server, and `next` is code that's staged and waiting to pulled into `master`. Some workflows go straight from `feature-branch` to `master`, but sometimes it pays to have a staging area in a team setting. Either way, do your thing.

### CircleCI

CircleCI is our automated test runner and code deployer. It listens for pushes to branches on GitHub, and then builds files, runs tests, and deploys code based on the branch in question. Our default configuration (located in [circle.yml](https://github.com/jonlong/functional-testing-starterkit/blob/master/circle.yml)) will run tests against CircleCI's local version of ChromeDriver whenever pushes or Pull Requests are made on feature branches (e.g. not `next` or `master`). These branches are most likely to get frequent commits/pushes, and the whole idea here is to keep development moving. Testing against a single baseline with local tools will help streamline things a bit while also providing some insurance in case we break something in the process.

`next` and `master` are different beasts. These branches will get auto-deployed when tests pass, so they need a more rigorous series of checks. We'll run Pull Requests against those through a diverse suite of browsers (mobile included) using [BrowserStack's Automate service](https://www.browserstack.com/automate).

**N.B.** These tests will take a while. Testing this way can also get pricey. The more tests you write, the more browsers you test against, the more time it takes, the more money it costs. In the long run, it's still cheaper than extensive manual testing, though. I also like to think of it as an insurance premium. Every time your clients or users report a bug, every time your CI server saves you from deploying broken code to production, every time a gross 3rd party script breaks your site without notice, your testing setup's got your back. Of all the things I covet in this profession, peace of mind is at the top of the list.

Ok, with that out of the way, here's how to set up your CI server:

- Connect your GitHub account to CircleCI
- Choose the free tier for now, which will allow you to run one build at a time (subsequent builds will queue behind the current one and run when it's complete)
- [Add a new project](https://circleci.com/add-projects) by choosing a repo from the list and clicking "build"
- The build is gonna fail, because we haven't really configured anything yet (it's going to take somewhere between a few and a bazillion tries before it passes during setup, so don't sweat it)
- Add any environment variables you may need in "Project Settings > Environment Variables"
- That's it! CircleCI is smart enough to detect most environments automatically and handle the gruntwork of dependency installation/caching, etc. The rest of our configuration will happen via [circle.yml](https://github.com/jonlong/functional-testing-starterkit/blob/master/circle.yml)

### Heroku Build Server:

At some point in your deployment pipeline, you'll probably want to run your tests in an environment that mirrors your production environment (rather than using a local server). CircleCI can deploy to any server, using custom commands, but for demo purposes we'll use their built-in Heroku integration. This Heroku server will be our "build" server, which functions as a duplicate of our production environment, and we'll use it exclusively for running tests via CircleCI.

- [Launch a new instance](https://dashboard.heroku.com/new) and add your Heroku app's url to `config.APP_SETTINGS.build_url`.
- Change the `HOST` environment variable to `0.0.0.0`
- Go to the Project Settings in CircleCI and follow Steps 1 and 2 under "Heroku Deployment" (adding an API key and assigning an SSH key).

#### Optional Production Server

If we want passing PRs to `master` to automatically deploy to production, we can launch another Heroku instance and specify it as the target deployment server.

- Launch a new instance as described above
- Change the name of the git repo in [this line in `circle.yml`](https://github.com/jonlong/functional-testing-starterkit/blob/master/circle.yml#L81) to match your production app's repo name (e.g the repo name for `functional-starterkit.herokuapp.com` is `functional-starterkit.git`)


### BrowserStack

- Sign up for [BrowserStack Automate](https://www.browserstack.com/users/sign_up)
- Copy your [Username and Access Key](https://www.browserstack.com/accounts/automate) and add them in `secrets.js` and the `BROWSERSTACK_USERNAME`/`BROWSERSTACK_ACCESSKEY` environment variables on CircleCI.

## Local Testing

Functional tests are run locally using ChromeDriver. `npm run tests:functional` to kick them off.

### Debugging

#### Front End

By default, ChromeDriver will quit once the tests have run, but if you want to leave it open for debugging, set `leaveRemoteOpen` (inside `intern.development.js`) to `true`.

#### Intern

You can debug your tests themselves by running `npm run tests:functional:debug`, which will launch a [Node Inspector](https://github.com/node-inspector/node-inspector) debugger in Chrome. The Debugger works almost exactly like Chrome Developer Tools.