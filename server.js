import express from 'express';
import cors from 'cors';
import knex from 'knex';
import bcrypt from 'bcryptjs';
import handleRegister from './controllers/register.js';
import handleSignin from './controllers/signin.js';
import handleProfileGet from './controllers/profile.js';
import handleImage from './controllers/image.js';
import { handleImageUrl } from './controllers/image.js';

const app = express()


// const db = knex({
//     client: 'pg',
//     connection: {
//         host: '127.0.0.1',
//         port: 5432,
//         user: 'postgres',
//         password: 'test',
//         database: 'smart-brain',
//     },
// });

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
    // ssl: {
    //   rejectUnauthorized: false,
    // },
  },
});



app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Smart Brain backend is running");
});

// app.get("/", (req, res) => {
//     db.select('*').from('users')
//         .then(data => res.json(data))
//         .catch(err => res.status(400).json("error"));
// })

app.post('/signin', handleSignin(db, bcrypt));

app.post('/register', handleRegister(db, bcrypt));

app.get('/profile/:id', handleProfileGet(db));

app.put('/image', handleImage(db));

app.post('/imageurl', handleImageUrl);

app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port ${process.env.PORT}`);
});
