import express from "express";
import { promises as fs } from "fs";
import { inserirGrades, getGrades, editarGrades, deleteGrades, getGradeById, somar, media, bestGrade } from "../Controllers/gradesController.js";
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
        res.send(await editarGrades(req.body));
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
        res.send({ total: await somar(req.params.stud, req.params.sub) })
    } catch (error) {
        console.log(error);
    }
});

router.get("/media/:sub/:type", async (req, res) => {
    try {
        res.send({ media: await media(req.params.sub, req.params.type) });
    } catch (error) {
        console.log(error)
    }
});
router.get("/bestGrade/:sub/:type", async (req, res) => {
    try {
        const top3 =await bestGrade(req.params.sub, req.params.type);
        res.send(top3.slice(0, 3));
    } catch (error) {
        console.log(error)
    }
});

export default router;