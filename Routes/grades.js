import express from "express";
import { promises as fs } from "fs";
import { timeStamp } from "console";
const { readFile, writeFile } = fs;

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        let grade = req.body;

        if (!grade.student || !grade.subject || !grade.type || !grade.value) {
            throw new Error("Preencha todos os campos como requerido");
        }

        const data = JSON.parse(await readFile(global.fileName));
        grade = {
            id: data.nextId++,
            student: grade.student,
            subject: grade.subject,
            type: grade.type,
            timestamp: new Date
        };
        data.grades.push(grade);
        await writeFile(global.fileName, JSON.stringify(data, null, 2));
        res.send(grade);
    } catch (err) {
        console.log(err)
    }
});

router.get("/", async (req, res) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        delete data.nextId
        res.send(data);
    } catch (err) {
        console.log(err)
    }
});

router.put("/", async (req, res) => {
    try {
        let grade = req.body;
        const data = JSON.parse(await readFile(global.fileName));

        const index = data.grades.findIndex(g => g.id === grade.id);

        if (index === -1) {
            throw new Error("Grade não encontrado");
        }
        if (!grade.student || !grade.subject || !grade.type || !grade.value) {
            throw new Error("Preencha todos os campos como requerido");
        }

        data.grades[index].student = grade.student;
        data.grades[index].subject = grade.subject;
        data.grades[index].type = grade.type;
        data.grades[index].value = grade.value;
        data.grades[index].timestamp = new Date;
        await writeFile(global.fileName, JSON.stringify(data, null, 2));
        res.send(grade);
    } catch (error) {
        console.log(error)
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        data.grades = data.grades.filter(grade => grade.id !== parseInt(req.params.id));
        await writeFile(global.fileName, JSON.stringify(data, null, 2))
        res.end();
    } catch (error) {
        console.log(error)
    }
    
});

export default router;