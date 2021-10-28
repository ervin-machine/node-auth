require("dotenv").config();
require("./config/database").connect();
const bcrypt = require("bcryptjs");
const User = require("./model/user");
const express = require("express");
const auth = require("./middleware/auth")
const app = express();

app.use(express.json());

app.post("/register", (req, res) => {
    try{
        const { first_name, last_name, email, password } = req.body;
        if(!(first_name && last_name && email && password)) {
            res.status(400).send("All input is required");
        }

        const oldUser = User.findOne({ email });

        if(oldUser){
            return res.status(409).send("User Already Exist. Please Login");
        }

        encryptedPassword = bcrypt.hash(password, 10);

        const user = User.create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            password: encryptedPassword,
        });

        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        user.token = token;

        res.status(201).json(user);
    } catch (err) {
        console.log(err);
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!(email && password)) {
            res.status(400).send("All input is required");
        }

        const user = await User.findOne( {email });

        if(user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                {user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );

            user.token = token;

            res.status(200).json(user);
        }
        res.status(400).send("invalid credentials");
    } catch (err) {
        console.log(err);
    }
});

app.post("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome");
});



module.exports = app;