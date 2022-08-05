import { Cloudinary } from "../../helpers";

function download(req, res) {
  try {
    const url = Cloudinary.downloadZipUrl({
      public_ids: req.body.files,
      flatten_folders: true,
    });
    res.status(200).json(url);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export default download;
