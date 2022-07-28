import { Cloudinary, isAuthentication } from "../../helpers";

async function destroy(req, res) {
  try {
    const files = req.body.files;
    await Promise.all(files.map((file) => Cloudinary.destroyFile(file)));
    res.status(200).end();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
}

export default destroy;
