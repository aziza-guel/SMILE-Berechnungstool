const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');


const app = express();
app.use(cors());
app.use(express.json());

const jsonFilePath = path.join(__dirname, 'convertcsv.json');
let jsonData = [];

fs.readFile(jsonFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error("Error reading file:", err);
        return;
    }
    jsonData = JSON.parse(data);
});

app.get('/api/values/:id', (req, res) => {
  const id = req.params.id;

  if (id === 'convertcsv') {
    // If 'convertcsv' is requested, return the entire jsonData array
    res.json(jsonData);
  } else {
    // Otherwise, attempt to find the item with the provided ID
    const result = jsonData.find(item => item.id === parseInt(id));

    if (result) {
      res.json(result);
    } else {
      console.error('Data not found for ID:', id);
      res.status(404).send('Data not found');
    }
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});