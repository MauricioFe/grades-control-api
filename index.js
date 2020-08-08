import express from "express";
import { promises as fs } from "fs";
const { readFile } = fs;


const app = express();
app.listen(3000, ()=>{
    console.log("API Started");
})