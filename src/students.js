import fs from 'fs';

class Students {
    constructor() {
        this.path = './src/json/students.json';
    }

    async addStudent(student, materia, note) {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const alumnos = JSON.parse(data);

            const existingStudentIndex = alumnos.findIndex(item => item.student === student);

            if (existingStudentIndex !== -1) {
                alumnos[existingStudentIndex].materias.push({ materia, note });
            } else {
                const nuevoAlumno = { student, materias: [{ materia, note }] };
                alumnos.push(nuevoAlumno);
            }

            await fs.promises.writeFile(this.path, JSON.stringify(alumnos, null, 2));
            return true
        } catch (error) {
            console.error('Error al agregar nota:', error);
            return false
        }
    }
}

const students = new Students();
export default students;
