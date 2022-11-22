import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  access_token: string;
	refresh_token: string
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log("token hit!");
  console.log({ body: req.body });
  res.status(200).json({ access_token: "some-token", refresh_token: "refresh_token" });
}
