import { deleteCloud, deleteFile } from "../utils/FileFunc.js";
export const globalErrorHandling = async (err, req, res, next) => {
  if (req.file) {
    deleteFile(req.file.path);
    // deleteCloud(req.file.path )
  }
  if (req.failImages) {
    for (const public_id of req.failImages) {
      await deleteCloud(public_id);
    }
  }
  const code = err.stausCode || 500;

  res.status(code).json({ error: "error", message: err.message });
  next();
};
