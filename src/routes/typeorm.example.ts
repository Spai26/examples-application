import { Router } from "express";

import { CategoryService } from "../category/category.service";
import { CategoryDocumentRepository } from "../category/infraestructure/document/repositories/category-repository";
import { getRepository } from "typeorm";
import { CategoryModel } from "../config/database/models/category.model";
const router = Router();

/**
 * @swagger
 * /api/typeorm:
 *   get:
 *     summary: Get all publications
 *     responses:
 *       200:
 *         description: Returns all publications
 */
router.post("/", async (req, res) => {
  const categoryModelRepository = getRepository(CategoryModel);
  const repo = new CategoryDocumentRepository(categoryModelRepository);
  const service = new CategoryService(repo);
  const result = service.create(req.body);
  res.send(result);
});

export default router;
