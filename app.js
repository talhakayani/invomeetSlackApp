const express = require('express');
const routes = require('./routes');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/slack', routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Running Successfully at ${PORT}`));
