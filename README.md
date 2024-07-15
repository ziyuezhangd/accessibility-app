# Access NYC
**Access NYC** is a web application designed to provide accessible routes & places recommendations for people with needs.

Visit the app: http://137.43.49.23/

## Features
- See accessible places across Manhattan
- See the predicted busyness, odor and noise levels at any given time
- Find nearest accessible restrooms and subway stations of any location
- Provide feedback to help keep the information up-to-date and accurate

## How to Contribute
1. Create your own branch from branch `dev` and start working on it
2. Frequently commit changes and push to remote repo on your own branch
3. Frequently merge changes from remote branch `dev` into your own local branch to keep it up-to-date
4. When the feature is ready, submit a pull request from your own branch to `dev`
5. After the pull request is approved, merge the pull request to branch `dev`
The maintenance lead will merge latest changes from `dev` into `main` periodically and deploy on the server


## How to run the app locally during development
### Install dependencies for frontend and backend
Run this command in `./mern/client` and `./mern/server`:
```bash
npm install
```

### Run the Flask app
Run this command in `./flask-api`:
```bash
python app.py
```
Make sure to install these packages: flask, flask_cors, pandas, numpy, scikit-learn(v1.2.2)

### Start the app
Run this commands in `./mern`:
```bash
npm run dev:all-con
```

You can also run the app without a locally running Flask app.The app will request the deployed Flask app instead.
Run this commands in `./mern`:
```bash
npm run dev:flask-remote
```

## Tech Stack
- Frontend: React
- Backend: Express + Node.js
- Database: MongoDB
- Data Analytics: Python Scikit-learn
