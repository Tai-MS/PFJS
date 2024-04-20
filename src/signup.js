import fs from 'fs';

class Signup {
    constructor() {
        this.path = './src/json/preceptores.json';
    }

    async signup(email, pass, confirmPass, name) {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const parsedData = JSON.parse(data);

            const emailExists = parsedData.some(user => user.email === email);
            if (emailExists) {
                return false; 
            }

            if (pass !== confirmPass) {
                return false; 
            }

            const newUser = { email, password: pass, name };
            parsedData.push(newUser);

            await fs.promises.writeFile(this.path, JSON.stringify(parsedData, null, 2));

            return true;
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            return false; 
        }
    }
}

const signup = new Signup();
export default signup;