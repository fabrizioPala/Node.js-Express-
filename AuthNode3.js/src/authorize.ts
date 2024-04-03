import { Request, Response, NextFunction } from "express";
import passport from "passport";

const authorize = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("jwt", { session: false }, (err: any, user: any) => {
    if (!user || err) {
      res.status(401).json({ msg: "unathorized" });
    } else {
      req.user = user;
      next();
    }
  })(req, res, next);
};

export default authorize;