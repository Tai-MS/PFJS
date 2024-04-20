import fs from 'fs';

class Login {
    constructor() {
        this.path = './src/json/preceptores.json';
    }

    async login(email, pass) {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const parsedData = JSON.parse(data);

            for (const user of parsedData) {
                console.log('user', user);
                console.log('parsed', email, pass);
                console.log(`EMAIL:${typeof(email)}, PASSWORD: ${user.password === pass}`);
                if (user.email === email && user.password === pass) {
                    return true; 
                }
            }

            return false; 
        }catch(e){
            console.log(e);
            return false
        }
    }
}

const login = new Login();
export default login;
