import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /api/example:
 *   get:
 *     summary: Get all publications
 *     responses:
 *       200:
 *         description: Returns all publications
 */
router.get("/", (req, res) => {
  res.send("mensaje de ejemplo");
});

export default router;
