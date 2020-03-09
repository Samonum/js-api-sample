// Welcome to the user database

const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.port || 3000;
const bcryptRounds = 12;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// The highest ID that has been added to the database
let maxId = 3;

let users = [{
    "id": 1,
    "username": "JoJohnson",
    "name": "Johnathan Johnson",
    "age": 23,
    "email": "J.Johnson@example.com",
    "password": bcrypt.hashSync("Jojo123", bcryptRounds),
},
{
    "id": 2,
    "username": "Alice",
    "name": "Alice",
    "age": 46,
    "email": "Alice123@example.com",
    "password": bcrypt.hashSync("1StrongPassword!", bcryptRounds),
},
{
    "id": 3,
    "username": "Admin",
    "name": "Ad Minder",
    "age": 35,
    "email": "AdMinder@example.com",
    "password": bcrypt.hashSync("@qr3MawrtT34!W-", bcryptRounds),
}];

let checkExists = newUser => {
    for (let user of users) {
        if (user.username === newUser.username) {
            return 'Username already exists';
        }
        if (user.email === newUser.email) {
            return 'Email already exists';
        }
    }
    return false;
}

// Adds a new user
app.post('/user', async(req, res) => {
    const newUser = req.body;
    
    let exists = checkExists(newUser);
    if (exists)
    {
        res.status(400).send(exists)
    }
    // Check if username and email are unique
    // Increase maxId and set it as the ID for the new user
    newUser.id = ++maxId;
    newUser.password = bcrypt.hashSync(newUser.password, bcryptRounds);
    users.push(newUser);

    delete newUser["password"];

    res.send(newUser);
});

// Return a list of all users
app.get('/user', async(req, res) => {
    // <Returns passwords>
    res.json(users);
});

// Return user data for the user for whom the field :search has value :val
app.get('/user/:search/:val', async(req, res) => {
    const search = req.params.search;
    const val = req.params.val;

    // Searching users for the right key value pair
    for (let user of users) {
        if (user[search] === val) {
            delete user.password;
            res.json(user);
            return;
        }
    }

    // Sending 404 when not found something is a good practice
    res.status(404).send('User not found');
});

// Removes a user
app.delete('/user/:id', (req, res) => {
    const id = req.params.id;

    // Remove user
    users = users.filter(i => {
        res.send('User has been removed');
        return (i.id !== id);
    });

    res.status(400).send('User not found');
});

// Replace user data for user :id
app.post('/user/:id', async(req, res) => {
    const id = req.params.id;
    const user = req.body;

    user.id = id;

    let exists = checkExists(user);
    if (exists)
    {
        res.status(400).send(exists)
    }

    // Update the user
    for (let i = 0; i < users.length; i++) {

        if (users[i].id === id) {
            user.password = bcrypt.hashSync(user.password, bcryptRounds);
            users[i] = user;
            delete user["password"];
            res.send(user);
            return
        }
    }

    res.status(404).send(`No user found with ID: ${id}`);
});

// Checks the username/password combination
app.get('/login', async(req, res) => {
    const credentials = req.body;

    for (let user of users) {
        if (user.usernames === credentials.username) {
            if (bcrypt.compareSync(user.password, credentials.password))
                res.send("Logged in successfully");
            else
                res.status(400).send("Incorrect password");
            return;
        }
    }
    res.status(400).send("User not found");
});

module.exports = app.listen(port, () => console.log(`Listening on port ${port}!`));