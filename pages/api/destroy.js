import { Cloudinary } from "../../backend/helpers";

async function destroy(req, res) {
  try {
    const files = req.body.files;
    await Promise.all(
      files.map((file) => Cloudinary.destroyFile(file, { invalidate: true }))
    );
    res.status(200).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export default destroy;
