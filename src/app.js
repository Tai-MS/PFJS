import express from 'express';
import path from 'path'
import { dirname } from "path";
import { fileURLToPath } from "url";

import login from '../src/login.js'
import signup from './signup.js';
import students from './students.js';


const app = express();
app.use(express.urlencoded({ extended: true }));
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/', async(req, res) => {
    const { student, materia, note } = req.body
    console.log(req.body);
    const result = await students.addStudent(student, materia, note)
    if(result){
        res.redirect('/')
    }
})

app.post('/login', async(req, res) => {
    const { email, loginPassword } = req.body; 
    const result = await login.login(email, loginPassword)
    console.log(result);
    if(result){
        res.redirect('/')
    }else{
        res.send('Error')
    }
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

app.post('/signup', async(req, res) => {
    const { email, password, confirmPassword, name } = req.body; 
    const result = await signup.signup(email, password, confirmPassword, name)
    if(result){
        res.redirect('/login')
    }else{
        res.send('Error')
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
