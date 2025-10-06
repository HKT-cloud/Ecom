
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/adddetails", (req, res) => {
  console.log(req.body);
  res.send("Data has been accepted");
});

// To send all details of the students that are added
app.get("/details", (req, res) => {
  res.send("All details so far...");
});

app.listen(4500, () => {
  console.log("Running on port 4500");
});