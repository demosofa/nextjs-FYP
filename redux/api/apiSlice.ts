import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { expireStorage } from "../../utils";

const baseQuery = fetchBaseQuery({
  baseUrl: `/`,
  credentials: "include",
  prepareHeaders(headers, api) {
    const accessToken = expireStorage.getItem("accessToken");
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 401 && result?.data === "Token is expire") {
    const refreshResult = await baseQuery(
      "/api/refreshToken",
      api,
      extraOptions
    );
    if (refreshResult?.data) {
      expireStorage.setItem("accessToken", refreshResult.data);
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

const apiSlice = createApi({
  reducerPath: "RTKApi",
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({}),
});

export default apiSlice;
