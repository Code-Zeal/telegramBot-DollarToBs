const app = require("./dependencies").app;

app.get("/", (req, res) => {
  res.send("Servidor de bot con puppeteer está funcionando correctamente");
});
const port = process.env.PORT || 4230;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
