const express = require('express');
const app = express();
const PORT = 3005;

// instalirati nodemon:
// npm install -g nodemon

app.get('/', (req, res) => {
  console.log('pozvan je GET endpoint!');
  res.send({ poruka: 'Pozdrav iz Expres.js poslužitelja' });
});

app.listen(PORT, error => {
  if (error) {
    console.error('Ne mogu startati... neda mi se..');
  } else {
    console.log(`Express.js poslužitelj sluša na portu ${PORT}`);
  }
});
