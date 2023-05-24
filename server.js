// Henriks console.log
import console from "hvb-console";

// ------------------- Setup user sessions -------------------
import cookieParser from "cookie-parser";
import session from "express-session";
import bcrypt from "bcrypt";

// ------------------- Custom middlewares -------------------
import { restrict } from "./middleware.js";

// ------------------- Setup express -------------------
import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;
// For encryption
const SALT_ROUNDS = 10;

// ------------------- Setup .env & Mongo -------------------
import dotenv from "dotenv";
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
import { MongoClient, ObjectId } from "mongodb";
// ObjectId is needed for accessing specific documents in mongoDB by ID

let accountCollection;
let usersCollection;

// ------------------- Setup SAP -------------------
// Importing the 'path' module for file path manipulation.
import path from "path";
// Resolving the current directory path.
const __dirname = path.resolve();

//! ------------------- Middlewares -------------------
app.use(cookieParser());
app.use(express.json());
/* express.json(): 
            handles JSON data in POST and PUT routes,
            similar to how middleware is needed to handle form data and URL-encoded data. 
        */
app.use(express.static("frontend/public"));
app.use(
    session({
        // don't save session if unmodified
        resave: false,
        // don't create session until something stored
        saveUninitialized: false,
        secret: "shhhh very secret string",
    })
);
// Middleware which should be moved to middleware.js soon:D -  when i work out the trouble i had with accessing the collection when importing it
const checkAuthorization = async (req, res, next) => {
    try {
        // Is current user, owner of the account they are currently trying to access
        const account = await accountCollection.findOne({
            _id: new ObjectId(req.params.id),
            user_id: req.session.userId, // Check ownership
        });

        console.log("account", account);

        if (account) {
            next();
        } else {
            res.status(401).json({
                acknowledged: false,
                error: "Unauthorized",
            });
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({
            acknowledged: false,
            error: err.message,
        });
    }
};

//! ------------------- Routes -------------------

//! Users
// Get active user
app.get("/api/user/active", (req, res) => {
    console.log("req.session", req.session);
    if (req.session.user) {
        const userId = req.session.userId;
        res.json({
            acknowledged: true,
            user: req.session.user,
            userId: userId,
        });
    } else {
        res.status(401).json({
            acknowledged: false,
            error: "Unauthorized",
        });
    }
});

// Login user
app.post("/api/user/login", async (req, res) => {
    try {
        const user = await usersCollection.findOne({
            user: req.body.loginName,
        });
        if (user) {
            const match = await bcrypt.compare(req.body.loginPass, user.pass);
            if (match) {
                // Set the user as current session
                req.session.user = user.user;
                req.session.userId = user._id;

                res.json({
                    acknowledged: true,
                    user: user.user,
                });
            } else {
                res.status(401).json({
                    acknowledged: false,
                    error: "Invalid username or password.",
                    customError: true,
                });
                return;
            }
        } else {
            res.status(401).json({
                acknowledged: false,
                error: "Invalid username or password.",
                customError: true,
            });
            return;
        }
    } catch (err) {
        console.error(err);
        res.status(401).json({
            acknowledged: false,
            error: err.message,
        });
    }
});

// Register user
app.post("/api/user/register", async (req, res) => {
    try {
        console.info("api register");

        const takenUsername = await usersCollection.findOne({
            user: req.body.regName,
        });
        console.log("takenUsername", takenUsername);
        if (!takenUsername) {
            console.log(req.body.regName);
            const hash = await bcrypt.hash(req.body.regPass, SALT_ROUNDS);

            const newUser = await usersCollection.insertOne({
                user: req.body.regName,
                pass: hash,
            });
            if (newUser.acknowledged) {
                console.log(newUser);
                req.session.user = req.body.regName;
                req.session.userId = newUser.insertedId;
                res.json({
                    acknowledged: true,
                    user: req.body.regName,
                });
            }
        } else {
            res.status(400).json({
                acknowledged: false,
                error: "Username already exists",
                customError: true,
            });
            return;
        }
    } catch (err) {
        console.error(err);
        res.status(400).json({
            acknowledged: false,
            error: err.message,
        });
    }
});

// Logout user
app.post("/api/user/logout", restrict, (req, res) => {
    req.session.destroy(() => {
        res.json({
            loggedin: false,
        });
    });
});

//! Bank accounts - plural

// Get all accounts - for authenticated user
app.get("/api/accounts", restrict, async (req, res) => {
    try {
        const accountsArr = await accountCollection
            .find({ user_id: req.session.userId })
            .toArray();
        res.json({
            acknowledged: true,
            accounts: accountsArr,
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({
            acknowledged: false,
            error: err.message,
        });
    }
});

// Create new account - for authenticated user
app.post("/api/accounts", restrict, async (req, res) => {
    console.log(req.body);
    try {
        const { accName, accAmount, user_id } = req.body;

        // Manual validation
        if (isNaN(parseFloat(accAmount))) {
            res.status(400).json({
                acknowledged: false,
                error: "Invalid data format",
                customError: true,
            });
            return;
        }

        const account = {
            name: accName,
            amount: parseFloat(accAmount),
            user_id,
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

//! Bank account - singular

// Get one account - authenticated
app.get("/api/accounts/:id", restrict, checkAuthorization, async (req, res) => {
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

// Update amount for one bank account - authenticated
app.put(
    "/api/accounts/:id/update-amount",
    restrict,
    checkAuthorization,
    async (req, res) => {
        try {
            // Manual check of balance
            const account = await accountCollection.findOne({
                _id: new ObjectId(req.params.id),
            });

            if (account.amount + req.body.amount < 0) {
                res.status(400).json({
                    acknowledged: false,
                    error: "Current balance too low for withdrawal",
                    customError: true,
                });
                return;
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
    }
);

// Update fields one account - authenticated - not used in bank atm but it works:)
app.put(
    "/api/accounts/:id/update-fields",
    restrict,
    checkAuthorization,
    async (req, res) => {
        /* todo!
         * Prevent user of api to create new keys
         * Return the updated data if succesfull update?
         * prevent user from udpating user_id key!!! muy importante
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
                res.status(400).json({
                    acknowledged: false,
                    error: "No modified account data was provided.",
                    customError: true,
                });
                return;
            } else if (response.acknowledged && response.modifiedCount === 1) {
                const updatedAccount = await accountCollection.findOne({
                    _id: new ObjectId(req.params.id),
                });
                res.json({
                    acknowledged: true,
                    account: updatedAccount,
                });
            }
        } catch (err) {
            console.error(err);
            res.status(400).json({
                acknowledged: false,
                error: err.message,
            });
        }
    }
);

// Delete one account - authenticated
app.delete(
    "/api/accounts/:id",
    restrict,
    checkAuthorization,
    async (req, res) => {
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
    }
);

app.get("/*", (req, res) => {
    /*
     * Regardless of the path sent to the server, always serve the index.html file.
     * This is necessary for SAP integration.
     * It ensures that the same HTML file is served, even if the requested path is different.
     */
    res.sendFile(path.join(__dirname, "frontend", "public", "index.html"));
});

// ------------------- Connect to db -------------------

if (MONGO_URI) {
    const client = new MongoClient(MONGO_URI);
    client
        .connect()
        .then(() => {
            console.log("Connected to MongoDB via MONGO_URI");

            // Define db and collections
            const db = client.db("bank");
            accountCollection = db.collection("accounts");
            usersCollection = db.collection("users");
        })
        .catch((error) => {
            console.log("Error connecting to MongoDB:", error);
        });
} else {
    console.log("No MongoDB URI provided. Starting with local MongoDB.");
    const client = new MongoClient("mongodb://localhost:27017");
    client
        .connect()
        .then(() => {
            console.log("Connected to local MongoDB");
            const db = client.db("bank");
            accountCollection = db.collection("accounts");
            usersCollection = db.collection("users");
        })
        .catch((error) => {
            console.log("Error connecting to local MongoDB:", error);
        });
}

//! ------------------- Start the server -------------------
// Starting the server and listening for http requests made to the specified port
app.listen(PORT, (err) => {
    if (err) {
        console.error("Error when listening: #", code, err);
        return;
    }
    console.log("Template is listening on port ", PORT);
});
