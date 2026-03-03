const express = require ("express");

const app=express();

app.use(express.json());

app.get("/", (req, res) => {
    res.end( "welcome");
})

const PORT = 9000;

app.listen(PORT, () =>{
    console.log(`Server is running on http://localhost:${PORT}`)
})
