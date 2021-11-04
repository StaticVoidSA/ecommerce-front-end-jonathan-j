const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.static(__dirname + '/dist/front-end'));

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/front-end/index.html'));
});

app.listen(port, (err) => {
    !err ? console.log(`Listening on port ${port}`)
         : console.log(`Unable to start server on port ${port}`);
});