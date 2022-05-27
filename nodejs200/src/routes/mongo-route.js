const router = require("express").Router();
const { mongoConnect } = require("../services/mongo");
const { ObjectId, ObjectID } = require("mongodb");

router.get("/", async (req, res) => {
  const db = mongoConnect();
  const fetchedTodos = await db.collection("todos").find().toArray();
  console.log(fetchedTodos);
  const todos = fetchedTodos.map((item) => ({ ID: item._id, ...item }));
  const fetchedComments = await db.collection("comments").find().toArray();
  console.log(fetchedComments);
  const comments = fetchedComments.map((item) => ({ ID: item._id, ...item }));
  res.render("index", { model: todos, comments: comments });
});

router.get("/create", (req, res) => {
  res.render("create", { model: {} });
});

router.post("/create", async (req, res) => {
  const db = mongoConnect();
  db.collection("todos")
    .insertOne({ Title: req.body.Title })
    .then((result) => {
      console.log("A todo has been added");
      res.redirect("/");
    });
});

router.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const db = mongoConnect();
  const fetchedTodo = await db
    .collection("todos")
    .findOne({ _id: ObjectId(id) });
  console.log(fetchedTodo);

  res.render("edit", { model: { ID: id, Title: fetchedTodo.Title } });
});

router.post("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const db = mongoConnect();
  db.collection("todos")
    .updateOne({ _id: ObjectId(id) }, { $set: { Title: req.body.Title } })
    .then((result) => {
      console.log("A to do has been updated");
      res.redirect("/");
    });
});

router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  const db = mongoConnect();
  db.collection("todos")
    .deleteOne({ _id: ObjectId(id) })
    .then((result) => {
      console.log("A todo has been deleted");
    });
});
router.get("/delete/:id", async (req, res) => {
  console.log("delete items");
});

router.get("/comment/:id", async (req, res) => {
  //   res.render("comment", { comments: {} });
  const id = req.params.id;
  res.render("comment", { module: { ID: id } });
});

router.post("/comment/:id", async (req, res) => {
  const id = req.params.id;
  const db = mongoConnect();
  db.collection("comments")
    .insertOne({ _post_id: ObjectId(id), Title: req.body.Title })
    .then((result) => {
      console.log("A comment has been added");
      res.redirect("/");
    });
});

module.exports = router;
