import express from 'express'
import mongoose from "mongoose"
import cors from "cors"
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";

const __dirname = path.resolve();
const PORT = process.env.PORT || 5000
const app = express()

mongoose.connect("mongodb+srv://admin:admin@cluster0.x26vs.mongodb.net/dev");


const Post = mongoose.model("Post", {
    postText: String,
    created: { type: Date, default: Date.now },

    date: String,
    tournament: String,
    inning: String,
})
app.use(express.json())

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5000"],
}))

app.use('/', express.static(path.join(__dirname, 'web/build')))
app.get("/", (req, res, next) => {
    res.sendFile(path.join(__dirname, "./web/build/index.html"))
    // res.send("hey im hit")
})


app.post('/api/v1/login', (req, res, next) => {
    res.send("hey im hit")

})

app.post("/api/v1/post", (req, res) => {
    const newPost = new Post({
        date: req.body.date,
        tournament: req.body.tournament,
        inning: req.body.inning,

    });
    newPost.save().then(() => {
        console.log("Post created");

        io.emit("POSTS", {
            date: req.body.date,
            tournament: req.body.tournament,
            inning: req.body.inning,
        });

        res.send("Post created");
    });
});


app.get("/**", (req, res, next) => {
    res.sendFile(path.join(__dirname, "./web/build/index.html"))
    // res.redirect("/")
})

// app.listen(PORT, () => {
//     console.log(`Example app listening at http://localhost:${PORT}`)
// })

const server = createServer(app);

const io = new Server(server, { cors: { origin: "*", methods: "*", } });

io.on("connection", (socket) => {
    console.log("New client connected with id: ", socket.id);


    socket.emit("topic 1", "some data")



    socket.on("disconnect", (message) => {
        console.log("Client disconnected with id: ", message);
    });
});


setInterval(() => {

    // to emit data to all connected client
    // first param is topic name and second is json data
    io.emit("Test topic", { event: "ADDED_ITEM", data: "some data" });
    console.log("emiting data to all client");

}, 2000)


server.listen(PORT, function () {
    console.log("server is running on", PORT);
})