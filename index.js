const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ShortUniqueId = require("short-unique-id");
const app = express();
const port = 3000;
const uid = new ShortUniqueId();
app.use(bodyParser.json());

mongoose
  .connect("mongodb+srv://root:1234@cluster0.sbjr9av.mongodb.net/db")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

const Url = mongoose.model("Url", {
  url: String,
  surl: String,
  count: { type: Number, default: 0 },
});

app.get("/api/redirect/:surl", async (req, res) => {
  try {
    const urlData = await Url.findOneAndUpdate(
      { surl: req.params.surl },
      { $inc: { count: 1 } }
    );
    if (urlData) {
      const surl3000 = urlData.surl;
      const url3000 = urlData.url;
      console.log("URL ", url3000);
      console.log("sURL ", surl3000);
      res.redirect(url3000);
    } else {
      res.status(404).send("URL not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/api/create", async (req, res) => {
  try {
    const { url } = req.body;
    const sUrl = uid.rnd(5);
    const newsUrl = sUrl;
    const newUrl = await Url.create({ url, surl: newsUrl });
    res.send(newUrl);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/api/show", async (req, res) => {
  try {
    const urls = await Url.find();
    res.send(urls);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete("/api/delete/:id", async (req, res) => {
  try {
    const deletedUrl = await Url.findByIdAndDelete(req.params.id);
    !deletedUrl ? res.status(404).send("Url not found") : res.send(deletedUrl);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
