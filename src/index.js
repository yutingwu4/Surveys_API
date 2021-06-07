const express = require('express');

const app = express();
app.use(express.json());

app.get('/healthcheck', (req, res) => {
	res.send({ 'hello': 'world' });
});

app.listen(3001, () => {
	console.log('surveys-api running on port 3001');
});