import { Cloudinary, isAuthentication, parseForm } from "../../helpers";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function upload(req, res) {
  try {
    const result = await parseForm(req);
    const { path, public_id } = result.fields;
    const file = result.files[Object.keys(result.files)[0]][0];
    const folder = await Cloudinary.createFolder(`CMS/${path}`);
    let options = {
      folder: folder.path,
      unique_filename: true,
    };
    if (public_id) options.public_id = public_id;
    const uploaded = await Cloudinary.uploadFile(file.filepath, options);
    res.status(200).json(uploaded);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export default upload;
