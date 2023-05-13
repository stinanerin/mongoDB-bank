// ------------------- Setup express -------------------
import express from "express";
//! nytt
import path from "path";
const __dirname = path.resolve();

//! nytt


const app = express();
const PORT = process.env.PORT || 3000;
// const port = 3000;



// ------------------- Mongo config -------------------
import { MongoClient, ObjectId } from "mongodb";
// ObjectId is needed for accessing specific documents in mongoDB by ID
const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("bank");
const accountCollection = db.collection("accounts");

// ------------------- Middlewares -------------------
app.use(express.json());
/* express.json(): 
    handles JSON data in POST and PUT routes,
    similar to how middleware is needed to handle form data and URL-encoded data. */

app.use(express.static("frontend/public"));

//! Nytt
app.get("/*", (req, res) => {
    // oavsett pathen vi skcikar till servern - gå tillbaka till index.html
    // nödvändigt fö SAP
    // alltså samma html fil, även om pathen är annorulunda
    res.sendFile(path.join(__dirname, "frontend", "public", "index.html"));
});

//! Nytt

// ------------------- Routes -------------------

// Accounts
app.get("/api/accounts", async (req, res) => {
    try {
        const response = await accountCollection.find({}).toArray();
        res.json({
            acknowledged: true,
            accounts: response,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            acknowledged: false,
            error: err.message,
        });
    }
});

app.post("/api/accounts", async (req, res) => {
    console.log("req.body", req.body);
    try {
        await accountCollection.insertOne(req.body);
        res.json({
            acknowledged: true,
            account: req.body,
        });
    } catch (err) {
        console.log(err);
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
        console.log(response);
        res.json({
            acknowledged: true,
            accounts: response,
        });
    } catch (error) {
        console.log(err);
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
        console.log(err);
        res.status(400).json({
            acknowledged: false,
            error: err.message,
        });
    }
})



app.put("/api/accounts/:id", async (req, res) => {
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
        console.log(err);
        res.status(400).json({
            acknowledged: false,
            error: err.message,
        });
    }
});

// Listens to the Express.js server for incoming HTTP requests on the specified port
app.listen(PORT, (err) => {
    if (err) {
        console.error("Error when listening: #", code, err);
        return;
    }
    console.log("Template is listening on port ", PORT);
});
