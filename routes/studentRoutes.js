const express = require("express");
const Student = require("../models/Student");

const router = express.Router();

router.get("/", async (req, res) => {
  const students = await Student.find().sort({ createdAt: -1 });
  res.render("index", { title: "Students", students });
});

router.get("/new", (req, res) => {
  res.render("create", { title: "Add Student", student: {}, errors: {} });
});

router.post("/", async (req, res) => {
  try {
    console.log("CREATE BODY:", req.body);

    const { name, age, course } = req.body;

    await Student.create({
      name,
      age: Number(age),
      course
    });

    res.redirect("/students");
  } catch (err) {
    console.log("CREATE ERROR:", err);

    const errors = err?.errors || {};
    const errorMsg = err?.message || "Something went wrong";
    res.status(400).render("create", {
      title: "Add Student",
      student: req.body,
      errors,
      errorMsg
    });
  }
});


router.get("/:id", async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).send("Student not found");
  res.render("show", { title: "Student Profile", student });
});

router.get("/:id/edit", async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).send("Student not found");
  res.render("edit", { title: "Edit Student", student, errors: {} });
});

router.put("/:id", async (req, res) => {
  try {
    const { name, age, course } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, age, course },
      { new: true, runValidators: true }
    );
    if (!student) return res.status(404).send("Student not found");
    res.redirect(`/students/${req.params.id}`);
  } catch (err) {
    const errors = err?.errors || {};
    const student = { _id: req.params.id, ...req.body };
    res.status(400).render("edit", { title: "Edit Student", student, errors });
  }
});

router.delete("/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.redirect("/students");
});

module.exports = router;
