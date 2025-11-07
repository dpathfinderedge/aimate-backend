import express from 'express';
const router = express.Router();

router.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", message: "AIMate server ia alive" });
});

export default router;