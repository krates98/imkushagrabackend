import mongoSanitize from "mongo-sanitize";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import LTGModel from "../models/LTGoals.js";

class AppController {
  static longTermGoals = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    req.body = mongoSanitize(req.body);

    const secretKey = process.env.JWT_SECRET_KEY;

    const { goals, description, date, token } = req.body;

    const decoded = jwt.verify(token, secretKey);

    const doc = new LTGModel({
      goals: goals,
      description: description,
      date: date,
      userid: decoded.userID,
    });

    await doc.save();

    res.send(doc);
  };

  static getLtgs = async (req, res) => {
    const secretKey = process.env.JWT_SECRET_KEY;

    const { token } = req.body;

    const decoded = jwt.verify(token, secretKey);

    const ltgs = await LTGModel.find({ userid: decoded.userID });

    res.send({ ltgs });
  };

  static deleteLtgs = async (req, res) => {
    const { ltgid } = req.body;

    const ltgs = await LTGModel.findOneAndDelete({ _id: ltgid.id });

    res.send({ ltgs });
  };
}

export default AppController;
