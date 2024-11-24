import express from "express";
import cors from "cors";
import proizvodiRouter from "./routes/proizvodi.js";
import narudzbeRouter from "./routes/narudzbe.js";
const app = express();
app.use(express.json());
app.use(cors());
app.use("/proizvodi", proizvodiRouter);
app.use("/narudzbe", narudzbeRouter);
const PORT = 3000;

app.get("/", (req, res) => {
  res.json("Webshop API");
});

app.listen(PORT, (error) => {
  if (error) {
    console.error(`Greška prilikom pokretanja poslužitelja: ${error.message}`);
  } else {
    console.log(`Server dela na http://localhost:${PORT}`);
  }
});
