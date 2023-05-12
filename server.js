// Setup express
import express from "express";
const app = express();
const port = 3000;




// Middlewares
app.use(express.json());
/* express.json(): handles JSON data in POST and PUT routes,
similar to how middleware is needed to handle form data and URL-encoded data. */
app.use(express.static("public"));


// Routes
app.get("/hello", (req, res) => {
    res.send("hello"); // Sends a "hello" response to the client
})


// Listens to the Express.js server for incoming HTTP requests on the specified port
app.listen(port, (err) => {
    if (err) {
        console.error("Error when listening: #", code, err);
        return;
    }
    console.log("Template is listening on port ", port);
});
