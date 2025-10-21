const express = require('express');
const app = express();
const PORT = 3000;
// predkoraci
// git clone <repo>
// cd u taj repo
// npm init -y
// npm install express
// napraviti index.js

app.listen(PORT, error => {
  if (error) {
    console.error('Ne mogu startati... neda mi se..');
  } else {
    console.log(`Express.js poslužitelj sluša na portu ${PORT}`);
  }
});
