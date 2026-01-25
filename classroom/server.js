const express = require("express");
const app = express();


app.get("/",(req,res)=>{
    res.send("Helllo Are you goint the port no 3000");
})
app.listen(3000,()=>{
    console.log("Server is ready for");
    
})