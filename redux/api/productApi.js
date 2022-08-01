import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const LocalApi = process.env.LOCAL_API;

const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${LocalApi}/product` }),
  tagTypes: ["Manage Product"],
  endpoints: (builder) => ({
    getPorduct: builder.query({ query: (id) => `/${id}` }),

    getAllProduct: builder.query({
      query: () => "/",
      providesTags: [{ type: "Manage Product", id: "LIST" }],
    }),

    createProduct: builder.mutation({
      query: (body) => ({
        method: "POST",
        "Content-type": "multipart/form-data",
        body,
      }),
      invalidatesTags: [{ type: "Manage Product", id: "LIST" }],
    }),

    updateProduct: builder.mutation({
      query: (body) => ({
        method: "PUT",
        "Content-type": "multipart/form-data",
        body,
      }),
      invalidatesTags: [{ type: "Manage Product", id: "LIST" }],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({ url: `/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Manage Product", id: "LIST" }],
    }),
  }),
});

export default productApi;
export const {
  useGetPorductQuery,
  useGetAllProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
