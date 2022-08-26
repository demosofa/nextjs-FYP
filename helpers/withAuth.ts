import { GetServerSidePropsContext, PreviewData } from "next";
import { ParsedUrlQuery } from "querystring";
import { Token, setCookieToken } from ".";

export default function withAuth(
  nextCb: (
    context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>,
    role?: string
  ) => Promise<any>
) {
  return async (
    context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
  ) => {
    const { req, res } = context;
    const { accessToken, refreshToken } = req.cookies;
    if (!accessToken && !refreshToken) {
      return {
        redirect: {
          destination: "/login",
          statusCode: 302,
        },
      };
    }
    let value: { accountId: string; userId: string; role: string };
    try {
      value = Token.verifyAccessToken(accessToken) as {
        userId: string;
        role: string;
        accountId: string;
      };
    } catch (error) {
      value = setCookieToken(req, res);
      req.headers.cookie = (res.getHeader("Set-Cookie") as string[]).join(", ");
    }
    return await nextCb(context, value?.role);
  };
}
