# Accessibility Application
**Accessibility NYC** (official name is to be finalized) is a web application designed to provide route&destination recommendations for people with disabilities.

## Features

## Workflow
1. Create your own branch from branch 'dev' and start working on it
2. Periodically commit changes and push to remote repo on your own branch
3. Periodically pull changes from remote repo on branch 'dev', and merge 'dev' into your own local branch to keep it up-to-date
4. When the feature/bug fix is ready, make a pull request from your own branch to 'dev'
5. After the pull request is reviewed, revised and approved, merge the pull request to branch 'dev'

Check [Notion-Development Lifecycle](https://www.notion.so/Development-Lifecycle-765c3a23d0ac4d3bb95618213883b4a8) for details

If anything unexpected or undesired happens after you make a commit, push to remote, make a pull request or whatever, don't worry and contact maintenance lead. We will fix it together!

## Running
Start frontend application for development, run:
```bash
npm install
npm run dev
```

Start backend application for development, run:
```bash
npm install
npm run dev
```

## Testing
- Conduct basic unit tests for the feature you develop on your own branch before merge it into 'dev'.
- Maintenance lead conducts unit tests, integration tests and E2E tests on branch 'dev' for all available features.
- Load test, security test and performance test will be conducted after sprint 3 when a minimal product is available by maintenance lead.


## Tech Stack
- Frontend: React
- Backend: Express + Node.js
- Database: MongoDB
- Data Analytics:
