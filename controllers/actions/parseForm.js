import formidable from "formidable";

export default async function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({});
    form.parse(req, (error, fields, files) => {
      if (error) reject(error);
      resolve({ fields, files });
    });
  });
}
