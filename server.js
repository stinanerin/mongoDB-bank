// Henriks console.log
import console from "hvb-console";
// ------------------- Setup user sessions -------------------

import cookieParser from "cookie-parser";
import session from "express-session";
import bcrypt from "bcrypt";
import { restrict } from "./middleware.js";

// ------------------- Setup express -------------------
import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;
console.log(process.env.PORT);

// ------------------- Setup SAP -------------------
// Importing the 'path' module for file path manipulation.
import path from "path";
// Resolving the current directory path.
const __dirname = path.resolve();

// ------------------- Mongo config -------------------
import { MongoClient, ObjectId } from "mongodb";
// ObjectId is needed for accessing specific documents in mongoDB by ID
const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("bank");

// Accounts collection
const accountCollection = db.collection("accounts");
// Users collection
const usersCollection = db.collection("users");

// ------------------- Middlewares -------------------
app.use(express.json());
/* express.json(): 
    handles JSON data in POST and PUT routes,
    similar to how middleware is needed to handle form data and URL-encoded data. 
*/

app.use(express.static("frontend/public"));

// ------------------- Routes -------------------
// Accounts - plural
app.get("/api/accounts", async (req, res) => {
    try {
        const response = await accountCollection.find({}).toArray();
        res.json({
            acknowledged: true,
            accounts: response,
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({
            acknowledged: false,
            error: err.message,
        });
    }
});

app.post("/api/accounts", async (req, res) => {
    console.info("req.body", req.body);
    try {
        const { name, amount } = req.body;

        // Manual validation
        if (typeof name !== "string" || isNaN(parseFloat(amount))) {
            throw new Error("Invalid data format");
        }

        const account = {
            name: name,
            amount: parseFloat(amount),
        };

        await accountCollection.insertOne(account);

        res.json({
            acknowledged: true,
            account: account,
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({
            acknowledged: false,
            error: err.message,
        });
    }
});

// Account - singular
app.put("/api/accounts/:id/update-amount", async (req, res) => {
    try {
        // Manual check of balance
        const account = await accountCollection.findOne({
            _id: new ObjectId(req.params.id),
        });

        if (account.amount + req.body.amount < 0) {
            throw new Error(
                `Current balance: ${account.amount}, too low for withdrawl`
            );
        }

        const response = await accountCollection.updateOne(
            // Filter
            { _id: new ObjectId(req.params.id) },
            // Updated body
            {
                $inc: {
                    amount: req.body.amount,
                },
            }
        );
        console.log("response before ack check", response);

        if (response.acknowledged && response.modifiedCount > 0) {
            console.info("here inside response.ack amount");
            const updatedAccount = await accountCollection.findOne({
                _id: new ObjectId(req.params.id),
            });
            res.json({
                acknowledged: true,
                account: updatedAccount,
            });
        } else {
            throw new Error("Something went wrong");
        }
    } catch (err) {
        console.error(err);
        res.status(400).json({
            acknowledged: false,
            error: err.message,
        });
    }
});

app.get("/api/accounts/:id", async (req, res) => {
    try {
        const response = await accountCollection.findOne({
            _id: new ObjectId(req.params.id),
        });
        console.info("res in get:id");
        console.log(response);
        res.json({
            acknowledged: true,
            accounts: response,
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({
            acknowledged: false,
            error: err.message,
        });
    }
});

app.delete("/api/accounts/:id", async (req, res) => {
    try {
        const response = await accountCollection.deleteOne({
            _id: new ObjectId(req.params.id),
        });

        if (response.deletedCount === 0) {
            throw new Error("No account found with the provided ID");
        }

        res.json({
            acknowledged: true,
            message: `Account #${req.params.id} successfully deleted`,
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({
            acknowledged: false,
            error: err.message,
        });
    }
});

app.put("/api/accounts/:id/update-fields", async (req, res) => {
    /* todo!
     * Prevent user of api to create new keys
     * Return the updated data if succesfull update?
     */
    try {
        const updatedData = { $set: {} };
        const keys = Object.keys(req.body);

        keys.forEach((key) => {
            /* Go in update objects $set-key property,
            set it to the value of req.body[key] */
            updatedData.$set[key] = req.body[key];
        });

        const response = await accountCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            updatedData
        );

        if (response.acknowledged && response.modifiedCount === 0) {
            throw new Error("No modified account data was provided.");
        } else if (response.acknowledged && response.modifiedCount === 1) {
            res.json(response);
        }
    } catch (err) {
        console.error(err);
        res.status(400).json({
            acknowledged: false,
            error: err.message,
        });
    }
});

app.get("/*", (req, res) => {
    /*
     * Regardless of the path sent to the server, always serve the index.html file.
     * This is necessary for SAP integration.
     * It ensures that the same HTML file is served, even if the requested path is different.
     * */
    res.sendFile(path.join(__dirname, "frontend", "public", "index.html"));
});

// Starting the server and listening for http requests made to the specified port
app.listen(PORT, (err) => {
    if (err) {
        console.error("Error when listening: #", code, err);
        return;
    }
    console.log("Template is listening on port ", PORT);
});
