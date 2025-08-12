import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import bcrypt from "bcrypt";
import { UserModel } from "../models/user.model.js";
import { JWT_SECRET } from "./env.js";
import { jwtExtractor } from "../utils/jwt.js";

passport.use(
  "register",
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
      session: false,
    },
    async (req, email, password, done) => {
      try {
        const exist = await UserModel.findOne({ email });
        if (exist) return done(null, false, { message: "Email ya registrado" });

        const { first_name, last_name, age, cart, role } = req.body;
        const hash = bcrypt.hashSync(password, 10);

        const user = await UserModel.create({
          first_name,
          last_name,
          email,
          age,
          password: hash,
          cart: cart || null,
          role: role || "user",
        });
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      session: false,
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.findOne({ email });
        if (!user)
          return done(null, false, { message: "Credenciales inválidas" });
        const ok = bcrypt.compareSync(password, user.password);
        if (!ok)
          return done(null, false, { message: "Credenciales inválidas" });
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  "current",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([jwtExtractor]),
      secretOrKey: JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await UserModel.findById(payload.uid).select("-password");
        if (!user)
          return done(null, false, {
            message: "Token válido pero usuario no existe",
          });
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);
