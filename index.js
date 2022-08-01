// Copyright 2018 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// [START main_body]
const {google} = require('googleapis');
const express = require('express');
const open = require('open');
const path = require('path');
const fs = require('fs');

const keyfile = path.join(__dirname, 'keys.json');
const keys = JSON.parse(fs.readFileSync(keyfile));
const scopes = ['https://www.googleapis.com/auth/spreadsheets'];

// Create an oAuth2 client to authorize the API call
const client = new google.auth.OAuth2(
  keys.web.client_id,
  keys.web.client_secret,
  keys.web.redirect_uris[0]
);

console.log("Client obj is :", client)

// Generate the url that will be used for authorization
this.authorizeUrl = client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
});

console.log(this.authorizeUrl)

// Open an http server to accept the oauth callback. In this
// simple example, the only request to our webserver is to
// /oauth2callback?code=<code>
const app = express();
app.get('/', (req, res) => {
  const code = req.query.code;

  console.log("code is :",code)
  client.getToken(code, (err, tokens) => {
    if (err) {
      console.error('Error getting oAuth tokens:');
      throw err;
    }

    console.log("token ", tokens)
    client.credentials = tokens;
    res.send('Authentication successful! Please return to the console.');
    server.close();
    listMajors(client);
  });
});
const server = app.listen(3000, async () => {
  // open the browser to the authorize url to start the workflow
  await open(this.authorizeUrl, {wait: false});
});

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
async function listMajors(auth) {
  const sheets = google.sheets('v4');
  sheets.spreadsheets.values.get(
    {
      auth: auth,
      spreadsheetId: '1-mnM10I1y4F6rEt4KQRe6lwevXhYA3WGhfF0kqP0yjo',
      range: 'A2:F31',
    },
    (err, res) => {
      if (err) {
        console.error('The API returned an error.');
        throw err;
      }
      const rows = res.data.values;
      console.log("values are : ", res.data.values)
      console.log("rows are : ", rows)
      // if (rows.length === 0) {
      //   console.log('No data found.');
      // } else {
        
        
      // }
    }
  );

  const res = await sheets.spreadsheets.values.update({
    auth: auth,
    spreadsheetId: '1-mnM10I1y4F6rEt4KQRe6lwevXhYA3WGhfF0kqP0yjo',
    range: 'A31:F31',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [
        [ 'aditya', 'Male', '4. Senior', 'FL', 'Math', 'yess' ]
      ],
    },
  });
  console.log(res.data);
  // return res.data;
}
// [END main_body]