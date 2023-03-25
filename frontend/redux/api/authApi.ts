import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
  retry,
} from "@reduxjs/toolkit/query/react";
import { expireStorage } from "../../utils";

export const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API,
  prepareHeaders: (headers, api) => {
    const token = expireStorage.getItem("accessToken");
    if (token) {
      headers.set("Authorization", token);
      return headers;
    }
  },
});

const baseQueryReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (
    result.error.status === 401 &&
    (result.error.data as any).message === "Token is expired"
  ) {
    const token = await baseQuery("/auth/refreshToken", api, extraOptions);
    if (
      result.error.status === 401 &&
      (<any>token.error.data).message === undefined
    ) {
      localStorage.clear();
    } else {
      expireStorage.setItem("accessToken", token);
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

const baseQueryRetry = retry(baseQueryReAuth, { maxRetries: 3 });
export const authApi = createApi({
  tagTypes: ["Product"],
  baseQuery: baseQueryRetry,
  endpoints: () => ({}),
});
