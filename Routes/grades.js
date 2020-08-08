import express from "express";
import { promises as fs } from "fs";
import {inserirGrades, getGrades, editarGrades, deleteGrades, getGradeById} from "../Controllers/gradesController.js";
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
        res.send(await getGrades());
    } catch (err) {
        console.log(err)
    }
});

router.put("/", async (req, res) => {
    try {      
        res.send( await editarGrades(req.body));
    } catch (error) {
        console.log(error)
    }
});

router.delete("/:id", async (req, res) => {
    try {
        deleteGrades(req.params.id);
        res.end();
    } catch (error) {
        console.log(error);
    }
});

router.get("/:id", async (req, res) => {
    try {
        res.send(await getGradeById(req.params.id));
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