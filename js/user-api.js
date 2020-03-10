// Welcome to the user database

const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const User = require("./models/user-model"); 

const app = express();
const port = process.env.port || 3000;
const bcryptRounds = 12;
const db = process.env.db || 'mongodb://mongo:27017';

mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true});

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

// Adds a new user
app.post('/user', async(req, res) => {
    let newUser = req.body;
    newUser.password = bcrypt.hashSync(newUser.password, bcryptRounds);
    new User(newUser).save((err, user) =>
        {
            if (err)
            {
                if(err.code == 11000)
                    res.status(400).send("A user with that username or email already exists.");
                else
                    res.status(400).send("Unable to add user to the database.");
                return;
            }
            
            delete user["password"];
            res.send(user);
        });

});

// Return a list of all users
app.get('/user', async(req, res) => {
    User.find({}, (err, users) => {
        res.send(users);
    });
});

// Return user data for the user for whom the field :search has value :val
app.get('/user/:search/:val', async(req, res) => {
    const search = req.params.search;
    const val = req.params.val;

    // Searching users for the right key value pair
    User.find({[search] : val}, (err, users) => {
        if (users.length === 0)
            return res.status(404).send("User not found");
        return res.send(users);
    });
});

// Removes a user
app.delete('/user/:id', async(req, res) => {
    const id = req.params.id;

    // Remove user
    User.findOneAndDelete({_id:id}, (err, user) => {
        if(err)
            return res.status(404).send("Unable to remove user");
        res.send(user);
    });
    
});

// Replace user data for user :id
app.post('/user/:id', async(req, res) => {
    const id = req.params.id;
    const user = req.body;
    if(typeof user.password !== 'undefined')
        user.password = bcrypt.hashSync(newUser.password, bcryptRounds);
    User.updateOne({_id: id}, user, (err, user) => {
        if(err)
            return res.status(404).send(`Unable to find user ${id}`);
        delete user["password"];
        res.send(user);
    });
});

// Checks the username/password combination
app.get('/login', async(req, res) => {
    const credentials = req.body;

    User.find({username: credentials.username}, (err, user) =>{
        if (user.length === 0)
            return res.status(404).send('User not found');
        if (user.usernames === credentials.username) {
            if (bcrypt.compareSync(user.password, credentials.password))
                res.send("Logged in successfully");
            else
                res.status(400).send("Incorrect password");
            return;
        }
    });
});

module.exports = app.listen(port, () => console.log(`Listening on port ${port}!`));
