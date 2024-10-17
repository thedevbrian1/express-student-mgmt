import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { MongoClient, ObjectId } from "mongodb";
import "dotenv/config";

let app = express();
let port = 3000;

// Get directory
let __fileName = fileURLToPath(import.meta.url);
let __dirName = path.dirname(__fileName);

// Use static assets
app.use(express.static("public"));

// Body parser
app.use(express.urlencoded({ extended: true }));

// Set templating engine
app.set("views", "./views");
app.set("view engine", "pug");

let uri = `mongodb+srv://hik75638:${process.env.MONGODB_PASSWORD}@cluster0.wwmwp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

let client = new MongoClient(uri);

app.get("/", async (req, res) => {
  let db = client.db("school");
  let collection = db.collection("students");

  let students = await collection.find().toArray();

  // console.log({ students });

  // await client.close();
  res.render("index", { students });
});

app.get("/students/:id", async (req, res) => {
  let id = req.params.id;

  let db = client.db("school");
  let collection = db.collection("students");

  let student = await collection.findOne({ _id: new ObjectId(id) });
  console.log({ student });

  res.render("student", { student });
});

app.post("/", async (req, res) => {
  console.log("Form submitted");

  // 1) Get the info from the form
  let body = req.body;

  console.log({ body });
  console.log({ hobbies: body.hobby });
  console.log({ classes: body.unit });

  let studentObj = {
    first_name: body["first-name"],
    last_name: body["last-name"],
    age: body.age,
    phone: body.phone,
    gender: body.gender,
    email: body.email,
    admission_number: Math.floor(Math.random() * 100),
    address: body.address,
    classes: body.unit,
    hobbies: body.hobby,
  };

  // 2) Validation
  if (Number(body.age) <= 0) {
    console.error("Invalid age");
    return res.render("index", {
      error: "Invalid input. Please check your form.",
    });
    // return res.status(400).render("error", { message: "Invalid age" });
  }

  // 3) Post it to the db
  let db = client.db("school");
  let studentsCollection = db.collection("students");

  let result = await studentsCollection.insertOne(studentObj);
  console.log({ result });

  // await client.close();

  res.redirect("/");
});

// CRUD

app.listen(port, () => console.log(`Server started on port ${port}`));
