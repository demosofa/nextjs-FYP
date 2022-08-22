import { IncomingForm, Fields, Files, Options } from "formidable";
import { Request } from "express";

export default function parseForm(
  req: Request,
  options: Partial<Options> = {
    multiples: true,
    keepExtensions: true,
    // uploadDir: "./public/",
  }
) {
  const form = new IncomingForm(options);
  return new Promise<{ fields: Fields; files: Files }>((resolve, reject) => {
    form.parse(req, (error, fields, files) => {
      if (error) reject(error);
      resolve({ fields, files });
    });
  });
}
