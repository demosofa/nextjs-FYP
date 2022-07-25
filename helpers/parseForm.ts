import { IncomingForm, Fields, Files, Options } from "formidable";
import { NextApiRequest } from "next";

export default function parseForm(req: NextApiRequest, options: Partial<Options> = {
  multiples: true,
  keepExtensions: true,
  encoding: "base64"
  // uploadDir: "./public/",
}) {
  const form = new IncomingForm(options);
  return new Promise<{fields: Fields, files: Files}>((resolve, reject) => {
    form.parse(req, (error, fields, files) => {
      if (error) reject(error);
      resolve({ fields, files });
    });
  });
}
