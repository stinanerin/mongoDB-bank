// Setup express
import express from "express";
const app = express();
const port = 3000;

// Mongo config
import { MongoClient, ObjectId } from "mongodb";
// ObjectId is needed for accessing specific documents in mongoDB by ID
const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("bank");
const accountCollection = db.collection("accounts");

// Middlewares
app.use(express.json());
/* express.json(): 
    handles JSON data in POST and PUT routes,
    similar to how middleware is needed to handle form data and URL-encoded data. */
app.use(express.static("public"));

// Routes

// Get all
app.get("/api/accounts", async (req, res) => {
    try {
        const response = await accountCollection.find({}).toArray();
        console.log("response", response);
        res.json({
            success: true,
            accounts: response,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            error: err.message,
        });
    }
});

// Add one
app.post("/api/accounts", async (req, res) => {
    console.log("req.body", req.body);
    try {
        await accountCollection.insertOne(req.body);
        res.json({
            success: true,
            account: req.body,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            error: err.message,
        });
    }
});

// Listens to the Express.js server for incoming HTTP requests on the specified port
app.listen(port, (err) => {
    if (err) {
        console.error("Error when listening: #", code, err);
        return;
    }
    console.log("Template is listening on port ", port);
});
