const express = require('express');
const axios = require('axios');

const app = express();

app.listen(8000, () => {
    console.log(`Server listening at http://localhost:8000`);
    fetchData()
})

