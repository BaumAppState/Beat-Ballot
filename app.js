const querystring = require('querystring');
const express = require('express');
const app = express();
const port = 8888;

const redirect_uri = "http://localhost:8888"
const client_id = "c1a7dda8473e4e8d8932ed88c9371e73";
const client_secret = "cbba7bbb553f491a8c0fcfdbbe8d66f5";

let stateString = '';

app.get('/login', (req, res) => {
    stateString = generateRandomString(16);
    let scope = 'user-read-private user-read-email';

    res.redirect('http://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri + '/logincallback',
        state: stateString
      }));
});

app.get('/logincallback', (req, res) => {
    if(req.query.error) {
        let errorMessage = req.query.error || 'Authentication error';
        res.status(403).send(errorMessage);
        return;
    }
    if(stateString !== req.query.state) {
        res.status(403).send('Invalid state');
        return;
    }

    res.send('Authentication successful');
});

function generateRandomString(length) {
    let chars = '0123456789' +
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
      'abcdefghijklmnopqrstuvwxyz';
    let result = '';

    for(let i = 0 ; i < length ; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
}

app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
});

