const express = require('express');

const dbRouter = require('../data/db-router.js');


const server = express();


server.use(express.json());

server.get("/", (req, res) => {
    res.status(200).json({ api: "is Up" });
});

server.use('/api/posts', dbRouter);



module.exports = server;