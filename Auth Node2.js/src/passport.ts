import * as dotenv from "dotenv";
dotenv.config();
import * as passport from "passport";
import * as passportJWT from "passport-jwt";
import { db } from "./db";

const { SECRET } = process.env;
const secretOrKey: string = SECRET || "";

passport.use(
  new passportJWT.Strategy(
    {
      secretOrKey: secretOrKey,
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (payload, done) => {
      try {
        const user = await db.one(
          "SELECT * FROM users WHERE id=$1",
          payload.id
        );
        console.log(user);
        return user ? done(null, user) : done(new Error("user not found"));
      } catch (error) {
        done(error);
      }
    }
  )
);