import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./authApi";

export const publicApi = createApi({
  baseQuery,
  endpoints: (build) => ({
    login: build.mutation({
      query: (body) => ({
        url: "auth/login",
        method: "post",
        body,
      }),
    }),
    register: build.mutation({
      query: (body) => ({
        url: "auth/register",
        method: "post",
        body,
      }),
    }),
    logout: build.mutation({
      query: () => ({
        url: "auth/logout",
        method: "post",
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } =
  publicApi;
