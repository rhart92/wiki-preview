// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { got } from "got";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
	// Use buffers instead
  const auth = "Basic " + btoa(`${process.env.clientId}:${process.env.clientSecret}`);
  const params = JSON.parse(req.body);
  const response = got.post(`${process.env.baseUrl}/v1/oauth/token`, {
    json: {
      code: params.code,
      grant_type: "authorization_code",
      external_account: {
        key: `hello ${Date.now()}`,
        name: `hello again ${Date.now()}`,
      },
    },
    headers: {
      authorization: auth,
    },
  });

  console.log({ response: await response.json() });

  res.status(200).json({ name: "John Doe" });
}
