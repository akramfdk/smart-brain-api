import express from 'express';
import cors from 'cors';
import knex from 'knex';

const app = express()

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        port: 5432,
        user: 'postgres',
        password: 'test',
        database: 'smart-brain',
    },
});

// console.log(db.select('*').from('users'));
// db.select('*').from('users').then(data => console.log(data));

app.use(cors());
app.use(express.json());

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get("/", (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email && 
    req.body.password === database.users[0].password){
        // res.json("success");
        res.json(database.users[0]);
    } else {
        res.status(400).json("Error logging in");
    }
    // res.json("signin")
})

app.post('/register', (req, res) => {

    const {email, name, password} = req.body;

    db('users')
        .returning('*')
        .insert({
        email: email,
        name: name,
        joined: new Date()
    })
        .then(user => {
            res.json(user[0]);
        })
        .catch(err => res.status(400).json('unable to register'));
})

app.get('/profile/:id', (req, res) => {
    const {id} = req.params;

    db.select('*').from('users').where({id})
        .then(user => {
            if (user.length){
                res.json(user[0]);
            } else {
                res.status(400).json("not found")
            }
        })
        .catch(err => res.status(400).json("error getting user"));
})

app.put('/image', (req, res) => {
    const {id} = req.body;

    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries)
    })
    .catch(err => res.status(400).json('unable to get entries'))
})

app.listen(3000, () => {
    console.log("app is running on port 3000");
});
