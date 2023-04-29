const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.get('/', (req, res) => res.send('안즈인포 2.0 대기방'));

app.listen(8001, () => console.log('Server Up and running at 8001'));
