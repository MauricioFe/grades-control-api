import express from "express";
import { promises as fs } from "fs";
import inserirGrades from "../Controllers/gradesController.js";
const { readFile, writeFile } = fs;

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        res.send(await inserirGrades(req.body));
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
        console.log(error);
    }
});

router.get("/:id", async (req, res) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        const grade = data.grades.find(g => g.id === parseInt(req.params.id));
        res.send(grade);
    } catch (error) {
        console.log(error);
    }
});

router.get("/somaNota/:stud/:sub", async (req, res) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        const filter = data.grades.filter(grade => {
            return grade.student === req.params.stud && grade.subject === req.params.sub;
        });
        const sum = filter.reduce((accumulator, current) => { return accumulator + current.value }, 0);
        res.send({ total: sum })
    } catch (error) {
        console.log(error);
    }
});

router.get("/media/:sub/:type", async (req, res) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        const filter = data.grades.filter(grade => {
            return grade.subject === req.params.sub && grade.type === req.params.type;
        });
        const sum = filter.reduce((accumulator, current) => {
            return accumulator + current.value;
        }, 0);

        const average = sum / filter.length;
        res.send({ media: average });
    } catch (error) {
        console.log(error)
    }
});
router.get("/bestGrade/:sub/:type", async (req, res) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        const filter = data.grades.filter(grade => grade.subject === req.params.sub && grade.type === req.params.type);
        const sort = filter.sort((a, b) => b.value - a.value);
        res.send(sort.slice(0,3));
    } catch (error) {
        console.log(error)
    }
});

export default router;