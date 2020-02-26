// Welcome to the user database

const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const argon2 = require('argon2');

const app = express()
const port = 3000

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// PW JoJohnson: Jojo123
// PW Alice: 1StrongPassword!
// PW Admin: @qr3MawrtT34!W-

let users = [{
    "id": 1,
    "username": "JoJohnson",
    "name": "Johnathan Johnson",
    "age": 20,
    "email": "J.Johnson@example.com",
    "password": "$argon2i$v=19$m=4096,t=3,p=1$Rp/xPwROxCcGubQ+fPq2Ww$j8d4Nz/navMj/WnmdjFRoPTwgYZ7mZXaFq12agetllg",
},
{
    "id": 2,
    "username": "Alice",
    "name": "Alice",
    "age": 20,
    "email": "Alice123@example.com",
    "password": "$argon2i$v=19$m=4096,t=3,p=1$Zsj93OrxC2UQdsozW2htjA$+GFhZGluLQ9SQTQsxbn3wgkNmeemQcKojY+ioE5rNPM",
},
{
    "id": 3,
    "username": "Admin",
    "name": "Ad Minder",
    "age": 20,
    "email": "AdMinder@example.com",
    "password": "$argon2i$v=19$m=4096,t=3,p=1$S6zkZGbGWPNjj8QPZnDCzA$zpdj/NQWE8A1cqtskmNeCW6dvtFKxTR0OvJXA6AV+gw",
}];

// Adds a new user
app.post('/user', async(req, res) => {
    const newUser = req.body;
    
    // Check if username and email are unique
    for (let user of users) {
        if (user.username === newUser.username) {
            res.status(400).send('Username already exists');
            return;
        }
        if (user.email === newUser.email) {
            res.status(400).send('Email already exists');
            return;
        }
    }
    // <Causes duplicate ids after deletion>
    newUser.id = users.length + 1;
    newUser.password = await argon2.hash(newUser.password);
    users.push(user);

    res.send('Created new user');
});

// Return a list of all users
app.get('/user', async(req, res) => {
    // <Returns passwords>
    res.json(users);
});

// Return user data for the user for whom the field :search has value :val
app.get('/user/:search/:val', (req, res) => {
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
        return (i.id !== id);
    });

    // <Returns success even when no user has been removed>
    res.send('User has been removed');
});

// Replace user data for user :id
app.post('/user/:id', (req, res) => {
    const id = req.params.id;
    const user = req.body;

    // Update the user
    for (let i = 0; i < users.length; i++) {

        if (users[i].is === id) {
            users[i] = user;
            res.send('User data has been updated');
            return
        }
    }

    res.status(404).send('No user found with ID: ' + id);
});

// Replace user data for user :id
app.post('/user/:id', (req, res) => {
    const id = req.params.id;
    const user = req.body;

    // Update the user
    for (let i = 0; i < users.length; i++) {

        if (users[i].id === id) {
            users[i] = user;
            res.send('User data has been updated');
            return
        }
    }

    res.status(404).send('No user found with ID: ' + id);
});

// Checks the username/password combination
app.get('/login', async(req, res) => {
    const credentials = req.body;

    for (let user of users) {
        if (user.usernames === credentials.username) {
            if (argon2.verify(user.password, credentials.password))
                res.send("Logged in successfully");
            else
                res.status(400).send("Incorrect password or username");
            return;
        }
    }
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
