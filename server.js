const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/dist/front-end'));

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/front-end/index.html'));
});


app.listen(port, (err) => {
    !err ? console.log(`Listening on port ${port}`)
         : console.log(`Unable to start server on port ${port}`);
});