const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');
const request = require('request');
const cors = require('cors');
const app = express();

admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


let today = new Date();
let d = new Date();
let dd = d.getUTCDate();

dd = parseInt(dd);
if (dd < 10) {
  dd = "0" + dd;
}
let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
let yyyy = today.getFullYear();

today = `${yyyy}-${mm}-${dd}`;



app.use(cors({ origin: true }));
app.get("/games", (req, res) => {
  const options = {
    method: "GET",
    url: `https://api-nba-v1.p.rapidapi.com/games/date/${encodeURIComponent(
      today
    )}`,
    headers: {
      "x-rapidapi-host": "api-nba-v1.p.rapidapi.com",
      "x-rapidapi-key": functions.config().nba.key
    },
  };
  request(options, (error, response) => {
    if (error) throw new Error(error);
    const data = JSON.parse(response.body);
    console.log(data.api.teams);
    res.send({
      data
    });
  });
});



app.get("/news", (req, res) => {
  const options = {
    method: "GET",
    url: `https://newsapi.org/v2/everything?q=NBA%playoffs&apiKey=${functions.config().news.key}`,
  };
  request(options, (error, response) => {
    if (error) throw new Error(error);
    const data = JSON.parse(response.body);
    res.send({
      data
    });
  });
});



exports.api = functions.https.onRequest(app);

