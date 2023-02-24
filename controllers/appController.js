import mongoSanitize from "mongo-sanitize";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import LTGModel from "../models/LTGoals.js";
import STGModel from "../models/STGoals.js";
import GraModel from "../models/Gratitude.js";

class AppController {
  //Long Term Goals List

  static longTermGoals = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    req.body = mongoSanitize(req.body);

    const secretKey = process.env.JWT_SECRET_KEY;

    const { goals, description, imageUrl, date, token } = req.body;

    const decoded = jwt.verify(token, secretKey);

    const doc = new LTGModel({
      goals: goals,
      description: description,
      imageurl: imageUrl,
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

    const ltgs = await LTGModel.find({ userid: decoded.userID }).sort({
      date: 1,
    });

    res.send({ ltgs });
  };

  static deleteLtgs = async (req, res) => {
    const { ltgid } = req.body;

    const ltgs = await LTGModel.findOneAndDelete({ _id: ltgid.id });

    res.send({ ltgs });
  };

  //Short Term Goals List

  static shortTermGoals = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    req.body = mongoSanitize(req.body);

    const secretKey = process.env.JWT_SECRET_KEY;

    const { goals, date, token } = req.body;

    const decoded = jwt.verify(token, secretKey);

    const doc = new STGModel({
      goals: goals,
      date: date,
      userid: decoded.userID,
      completed: false,
    });

    await doc.save();

    res.send(doc);
  };

  static getStgs = async (req, res) => {
    const secretKey = process.env.JWT_SECRET_KEY;

    const { token } = req.body;

    const decoded = jwt.verify(token, secretKey);

    const stgs = await STGModel.find({ userid: decoded.userID }).sort({
      completed: 1,
      date: 1,
    });

    res.send({ stgs });
  };

  static completeStgs = async (req, res) => {
    const { stgid } = req.body;

    const stg = await STGModel.findOne({ _id: stgid }); // Find the document by ID

    const updatedStg = await STGModel.findOneAndUpdate(
      { _id: stgid },
      { $set: { completed: !stg.completed } },
      { new: true }
    );

    res.send(updatedStg);
  };

  static deleteStgs = async (req, res) => {
    const { stgid } = req.body;

    console.log(stgid);

    const stgs = await STGModel.findOneAndDelete({ _id: stgid });

    res.send(stgs);
  };

  //Gratitude List

  static gratitudeList = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    req.body = mongoSanitize(req.body);

    const secretKey = process.env.JWT_SECRET_KEY;

    const { list, token } = req.body;

    const decoded = jwt.verify(token, secretKey);

    const doc = new GraModel({
      list: list,
      userid: decoded.userID,
    });

    await doc.save();

    res.send(doc);
  };

  static getGrat = async (req, res) => {
    const secretKey = process.env.JWT_SECRET_KEY;

    const { token } = req.body;

    const decoded = jwt.verify(token, secretKey);

    const grat = await GraModel.find({ userid: decoded.userID }).sort({
      date: 1,
    });

    res.send({ grat });
  };

  static deleteGrat = async (req, res) => {
    const { gratid } = req.body;

    const grat = await GraModel.findOneAndDelete({ _id: gratid });

    res.send(grat);
  };

  //Visualization

  static getVisual = async (req, res) => {
    const secretKey = process.env.JWT_SECRET_KEY;
    const { token } = req.body;

    const decoded = jwt.verify(token, secretKey);

    try {
      const docs = await LTGModel.find(
        { userid: decoded.userID },
        { imageurl: 1, _id: 0 }
      );

      const imageUrlArray = docs.map((doc) => doc.imageurl);

      res.send(imageUrlArray);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  };
}

export default AppController;
