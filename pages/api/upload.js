import { Cloudinary, isAuthentication, parseForm } from "../../helpers";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function upload(req, res) {
  try {
    const result = await parseForm(req);
    const path = result.fields.path;
    const files = result.files[Object.keys(result.files)[0]];
    const folder = await Cloudinary.createFolder(`CMS/${path}`);
    const uploaded = await Promise.all(
      files.map((file) =>
        Cloudinary.uploadFile(file.filepath, {
          folder: folder.path,
          unique_filename: true,
        })
      )
    );
    res.status(200).json(uploaded);
  } catch (err) {
    res.status(500).json({ message: err });
  }
}

export default upload;
