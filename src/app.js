import express from "express";
import cookieParser from "cookie-parser";
import passport from "passport";

import { PORT } from "./config/env.js";
import { connectDB } from "./db.js";
import "./config/passport.js";

import usersRouter from "./routes/users.routes.js";
import sessionsRouter from "./routes/sessions.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use("/api/users", usersRouter);
app.use("/api/sessions", sessionsRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Error interno" });
});

await connectDB();
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
