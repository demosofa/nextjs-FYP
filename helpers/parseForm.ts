import { IncomingForm, Fields, Files } from "formidable";
import { NextApiRequest } from "next";

export default function parseForm(req: NextApiRequest) {
  const form = new IncomingForm({
    multiples: true,
    keepExtensions: true,
    // uploadDir: "./public/",
  });
  return new Promise<{fields: Fields, files: Files}>((resolve, reject) => {
    form.parse(req, (error, fields, files) => {
      if (error) reject(error);
      resolve({ fields, files });
    });
  });
}
