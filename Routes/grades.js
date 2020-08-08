import express from "express";
import { promises as fs } from "fs";
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
        })
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
        const filter = data.grades.filter(grade => grade.subject === req.params.sub && grade.type === req.params.type)
        const sort = filter.sort((a, b) => b.value - a.value);
        res.send(sort.slice(0,3));
    } catch (error) {
        console.log(error)
    }
});

export default router;