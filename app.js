const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, './dist')));

app.get('*', (req, res) => {
  res.header('X-XSS-Protection', 0);
  res.status(200).sendFile(path.join(__dirname, './dist/index.html'));
});

const port = process.env.PORT || 3000;
const logger = console;

app.listen(port, () => logger.log(`Listening on ${port}`));