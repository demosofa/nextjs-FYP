import { IncomingForm } from "formidable";

export default function parseForm(req) {
  const form = new IncomingForm({
    multiples: true,
    keepExtensions: true,
    // uploadDir: "./public/",
  });
  return new Promise((resolve, reject) => {
    form.parse(req, (error, fields, files) => {
      if (error) reject(error);
      resolve({ fields, files });
    });
  });
}
