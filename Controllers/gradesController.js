import { promises } from "fs";
const { readFile, writeFile } = promises;

async function inserirGrades(grade) {
    if (!grade.student || !grade.subject || !grade.type || !grade.value) {
        throw new Error("Preencha todos os campos como requerido");
    }

    const data = JSON.parse(await readFile(global.fileName));
    grade = {
        id: data.nextId++,
        student: grade.student,
        subject: grade.subject,
        type: grade.type,
        value: grade.value,
        timestamp: new Date
    };
    data.grades.push(grade);
    await writeFile(global.fileName, JSON.stringify(data, null, 2));
    return grade;
}

async function getGrades() {
    const data = JSON.parse(await readFile(global.fileName));
    delete data.nextId
    return data;
}

async function editarGrades(grade) {
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
    return grade;
}

async function getGradesById(id) {
    const data = JSON.parse(await readFile(global.fileName));
    data.grades = data.grades.filter(grade => grade.id !== parseInt(id));
    await writeFile(global.fileName, JSON.stringify(data, null, 2))
}
export { inserirGrades, getGrades, editarGrades, getGradesById }