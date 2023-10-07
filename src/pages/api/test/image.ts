import { NextApiRequest, NextApiResponse } from "next";
import formidable, { errors as formidableErrors } from "formidable";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = await new Promise((resolve, reject) => {
    const form = formidable({});

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.log("err", err);
        reject({ err });
      }
      resolve({ err, fields, files });
    });
  });

  res.status(200).json({ data: data });
}
