const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const formSchema = new mongoose.Schema({
  formName: String,
  fields: Array,
});

const Form = mongoose.model("Form", formSchema);

app.post("/forms", async (req, res) => {
  try {
    const form = new Form(req.body);
    await form.save();
    res.status(201).send(form);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/forms", async (req, res) => {
  try {
    const forms = await Form.find();
    res.send(forms);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/forms/:id", async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).send();
    }
    res.send(form);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put("/forms/:id", async (req, res) => {
  try {
    const form = await Form.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!form) {
      return res.status(404).send();
    }
    res.send(form);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete("/forms/:id", async (req, res) => {
  try {
    const form = await Form.findByIdAndDelete(req.params.id);
    if (!form) {
      return res.status(404).send();
    }
    res.send(form);
  } catch (error) {
    res.status(500).send(error);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
