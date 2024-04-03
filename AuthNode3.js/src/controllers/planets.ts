import { Request, Response } from "express";
import Joi from "joi";
import {db} from "./../db.js"
const getAll = async (req: Request, res: Response) => {
  try {
    const planets = await db.many(`SELECT * FROM planets;`);
    console.log(planets);
    res.status(200).json(planets);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ msg: "An error occurred while fetching all planets" });
  }
};

const getOneById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const planet = await db.oneOrNone(
      `SELECT * FROM planets WHERE id=$1;`,
      Number(id)
    );
    res.status(200).json(planet);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ msg: "An error occurred while fetching the planet by ID" });
  }
};

const planetSchema = Joi.object({
  // id: Joi.number().required(),
  name: Joi.string().required(),
});

const create = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const newPlanet = { name };
    const validateNewPlanet = planetSchema.validate(newPlanet);

    if (validateNewPlanet.error) {
      return res
        .status(400)
        .json({ msg: validateNewPlanet.error.details[0].message });
    } else {
      await db.none(`INSERT INTO planets (name) VALUES ($1)`, name);
      res.status(201).json({ msg: "the planet was created" });
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ msg: "An error occurred while creating the planet" });
  }
};

const updateById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    await db.none(`UPDATE planets SET name=$2 WHERE id=$1`, [id, name]);
    res.status(200).json({ msg: "the planet was updated" });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ msg: "An error occurred while updating the planet by ID" });
  }
};

const deleteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.none("DELETE FROM planets WHERE id=$1", Number(id));
    res.status(200).json({ msg: "The planet was deleted" });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ msg: "An error occurred while deleting the planet by ID" });
  }
};

const createImage = async (req: Request, res: Response) => {
  try {
    console.log(req.file);
    const { id } = req.params;
    const fileName = req.file?.path;

    if (fileName) {
      await db.none(`UPDATE planets SET image=$2 WHERE id=$1`, [id, fileName]);
      res.status(201).json({ msg: "Planet image uploaded successfully" });
    } else {
      res.status(400).json({ msg: "Planet image failed to upload" });
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ msg: "An error occurred while uploading the planet image" });
  }
};
export { getAll, getOneById, create, updateById, deleteById, createImage };