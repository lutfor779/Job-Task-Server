const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8qcwn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

async function run() {
	try {
		await client.connect();
		const database = client.db("Job_Task");
		const movieHouseUsersCollection =
			database.collection("movie_house_users");

		// get user api
		app.get("/movie_house_users", async (req, res) => {
			const cursor = movieHouseUsersCollection.find({});
			const users = await cursor.toArray();
			console.log("Movie house users found");
			res.send(users);
		});

		// save user api
		app.post("/usemovie_house_users", async (req, res) => {
			const user = req.body;
			const result = await movieHouseUsersCollection.insertOne(user);
			console.log("Movie house users data saved");
			res.json(result);
		});

		// update user api
		app.put("/movie_house_users", async (req, res) => {
			const user = req.body;
			const filter = { email: user.email };
			const options = { upsert: true };
			const updateDoc = { $set: user };
			const result = await movieHouseUsersCollection.updateOne(
				filter,
				updateDoc,
				options
			);
			console.log("movie house update user data");
			res.json(result);
		});

		console.log("database connection ok");
	} finally {
		// await client.close();
	}
}
run().catch(console.dir);

app.get("/", (req, res) => {
	res.send("Welcome to Job Task Server!");
});

app.listen(port, () => {
	console.log(`This server listening at :${port}`);
});
