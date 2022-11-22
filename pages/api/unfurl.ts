import got from "got";
import { last } from "lodash";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  uri: string;
  operations: any[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log({ unfurlBody: req.body, unfurlAuth: req.headers.authorization });

  const titleFromUrl: string | undefined = last(req.body.uri.split("/"));

  console.log(titleFromUrl);

  const error = {
    uri: req.body.uri,
    operations: [
      {
        path: ["error"],
        set: {
          status: 404,
          message: "Failed to do a thing",
        },
      },
    ],
  };

  // Do wiki stuff
  const response = got.get("https://en.wikipedia.org/w/api.php", {
    searchParams: {
      format: "json",
      action: "query",
      prop: "categories|revisions|imageinfo|extracts|pageimages|info|pageviews|description|pageterms",
      exintro: true,
      explaintext: true,
      titles: titleFromUrl,
			piprop: "thumbnail",
			pithumbsize: 600
    },
  });

  const data: any = await response.json();

  const key = Object.keys(data.query.pages)[0];

  if (!key) {
    res.status(200).json(error);
  }

  const pageInfo = data.query.pages[key];

  if (!pageInfo) {
    res.status(200).json(error);
  }

  const title = pageInfo.title;
  const extract = pageInfo.extract;
  const imageSrc = pageInfo.thumbnail?.source;

  res.status(200).json({
    uri: req.body.uri,
    operations: [
      {
        path: ["attributes"],
        set: [
          {
            id: "title",
            name: "Title",
            type: "inline",
            inline: {
              title: {
                value: title,
                section: "title",
              },
            },
          },
          // {
          //   id: "categories",
          //   name: "Categories",
          //   type: "inline",
          //   inline: {
          //     plain_text: {
          //       value: "hello",
          //       // section: "identifier",
          //       section: "primary",
          //     },
          //   },
          // },
          // {
          //   id: "other",
          //   name: "Other",
          //   type: "inline",
          //   inline: {
          //     plain_text: {
          //       value: "bye",
          //       // Bottom left
          //       // section: "identifier",
          //       section: "primary",
          //     },
          //   },
          // },
          // {
          //   id: "views",
          //   name: "Views",
          //   type: "inline",
          //   inline: {
          //     plain_text: {
          //       value: "2300",
          //       // Bottom left
          //       // section: "identifier",
          //       section: "secondary",
          //     },
          //   },
          // },
          ...(Boolean(imageSrc)
            ? [
                {
                  id: "picture",
                  name: "Picture",
                  type: "embed",
                  embed: {
                    src_url: imageSrc,
                    image: {
                      // Large preview
                      section: "embed",
                      // Top left
                      // section: "avatar"
                      // Bottom left
                      // section: "entity"
                    },
                  },
                },
              ]
            : []),
          {
            id: "avatar_url",
            name: "Avatar URL",
            type: "embed",
            embed: {
              src_url:
                "https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/1200px-Wikipedia-logo-v2.svg.png",
              image: {
                // Large preview
                // section: "embed"
                // Top left
                // section: "avatar"
                // Bottom left
                section: "entity",
              },
            },
          },
          {
            id: "avatar_url2",
            name: "Avatar URL2",
            type: "embed",
            embed: {
              src_url:
                "https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/1200px-Wikipedia-logo-v2.svg.png",
              image: {
                // Large preview
                // section: "embed"
                // Top left
                section: "avatar"
                // Bottom left
                // section: "entity",
              },
            },
          },
          {
            id: "description",
            name: "Description",
            type: "inline",
            inline: {
              plain_text: {
                value: extract,
                section: "body",
              },
            },
          },
          // {
          //   id: "updated_at",
          //   name: "Updated At",
          //   type: "inline",
          //   inline: {
          //     datetime: {
          //       value: "2022-01-11T19:53:18.829Z",
          //       section: "secondary",
          //     },
          //   },
          // },
          // {
          //   id: "label",
          //   name: "Label",
          //   type: "inline",
          //   inline: {
          //     enum: {
          //       value: "🔨 Ready to Build",
          //       color: {
          //         r: 100,
          //         g: 100,
          //         b: 100,
          //       },
          //       section: "primary",
          //     },
          //   },
          // },
        ],
      },
    ],
  });
}
