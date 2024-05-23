import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from 'url';
import dbRoutes from "./routes/dbRoutes.js";
import viewRoutes from "./routes/viewRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import loginRouter from "./routes/login.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Set 'views' directory for any views being rendered
app.set('views', path.join(__dirname, 'views'));

// Set view engine to use EJS
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Add this to handle JSON payloads

// Use route modules
app.use("/", loginRouter);
app.use("/", viewRoutes);
app.use("/", dbRoutes);
app.use("/", studentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
