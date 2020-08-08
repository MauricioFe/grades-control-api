import express from "express";
import { promises as fs } from "fs";
const { readFile } = fs;
import router from "./Routes/grades.js";

global.fileName = "./Data/grades.json";

const app = express();
app.use(express.json());

app.use("/grades", router);

app.listen(3000, async ()=>{
    try {
        await readFile(global.fileName);
    } catch (err) {
        console.log(err)
    }
})