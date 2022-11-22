import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();

  const [query, setQuery] = useState<
    | {
        code: string;
        redirect_uri: string;
        state: any;
      }
    | undefined
  >();

  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (router.isReady) {
      const query = router.query;

      const { code, redirect_uri, state } = query;

      if (
        !code ||
        typeof code !== "string" ||
        !redirect_uri ||
        typeof redirect_uri !== "string" ||
        !state
      ) {
        setError("Invalid request.");
        return;
      }

			fetch("/api/hello", {
				method: "post",
				body: JSON.stringify({
					code,
					redirect_uri,
					state
				})
			})
        .then((res) => res.json())
        .then((data) => {
          console.log({ data });
          setQuery({
            code,
            redirect_uri,
            state,
          });
        });
    }
  }, [router.isReady]);

  if (!query) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const url = new URL(query.redirect_uri);
  url.searchParams.set("code", "1234");
	url.searchParams.set("state", query.state);
	// To test failures
	// url.searchParams.set("error", "Failed")
	// url.searchParams.set("error_description", "More information about failure")

  console.log({ redirectTo: url.toString() });

  return <Link href={url.toString()}>Do the thing?</Link>;
}
