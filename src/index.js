const express = require("express");
const betterSqlite3 = require("better-sqlite3");
const { z } = require("zod");
const apiRouter = require("./routers/apiRouter");

const app = express();
const PORT = 3000;

app.use("/", express.static("public"));
app.use(express.json());

app.use("/api", apiRouter);

app.use((req, res) => {
    res.status(404).send("page not found");
});

async function main() {
    console.log("Patient Record Server");

    app.listen(PORT, () => {
        console.log(`Server running at http://127.0.0.1:${PORT}`);
    });
}

main().catch((err) => console.log(err));
