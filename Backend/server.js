const express = require('express');
const bodyParser = require('body-parser');
const bookRoutes = require('./routes/book.routes');
const cors = require("cors");

const app = express();

// parse requests of content-type - application/json
app.use(bodyParser.json());
app.use(cors());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Book Store API." });
});

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

// Routes
app.use('/api/books', bookRoutes);