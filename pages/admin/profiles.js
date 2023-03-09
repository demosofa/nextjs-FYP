import Head from "next/head";
import { useState } from "react";
import { useDispatch } from "react-redux";
import useSWR from "swr";
import { Loading, Pagination, Search } from "../../frontend/components";
import { ThSortOrderBy } from "../../frontend/containers";
import { fetcher } from "../../frontend/contexts/SWRContext";
import { addNotification } from "../../frontend/redux/reducer/notificationSlice";
import { capitalize } from "../../frontend/utils";
import { Role } from "../../shared";

const LocalApi = process.env.NEXT_PUBLIC_API;

export default function ManageProfiles() {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState({
    search: "",
    page: 1,
    sort: "role",
    role: "",
    orderby: -1,
  });
  const dispatch = useDispatch();
  const { data, error, mutate } = useSWR({
    url: `${LocalApi}/admin/profiles`,
    params: query,
  });

  const handleChangeRole = (e, index) => {
    mutate(async (data) => {
      try {
        await fetcher({
          url: `${LocalApi}/admin/profiles/${data.lstProfile[index]._id}`,
          method: "patch",
          data: { role: e.target.value },
        });
        data.lstProfile[index].role = e.target.value;
      } catch (error) {
        dispatch(addNotification({ message: error.message, type: "error" }));
      }
      return data;
    });
  };

  const handleBlockUser = (index) => {
    mutate(async (data) => {
      try {
        const profile = data.lstProfile[index];
        await fetcher({
          url: `${LocalApi}/admin/profiles/${profile._id}`,
          data: { blocked: !profile.blocked },
          method: "put",
        });
        const content = `Your Profile has been ${
          profile.blocked ? "unblocked" : "blocked"
        }`;
        await fetcher({
          url: `${LocalApi}/notify`,
          method: "post",
          data: {
            to: profile._id,
            content,
          },
        });
        data.lstProfile[index].blocked = true;
      } catch (error) {
        dispatch(addNotification({ message: error.message, type: "error" }));
      }
      return data;
    });
  };
  const handleDeleteUser = (index) => {
    mutate(async (data) => {
      try {
        await fetcher({
          url: `${LocalApi}/admin/profiles/${data.lstProfile[index]._id}`,
          method: "delete",
        });
        data.lstProfile = data.lstProfile.filter((_, i) => i !== index);
      } catch (error) {
        dispatch(addNotification({ message: error.message, type: "error" }));
      }
      return data;
    });
  };

  const isLoadingInitialData = (!data && !error) || error;

  return (
    <div className="px-24 sm:p-4 md:px-10">
      <Head>
        <title>Manage Profiles</title>
        <meta name="description" content="Manage Profiles" />
      </Head>
      <div className="flex flex-wrap gap-4">
        <Search
          className="!ml-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClick={() => setQuery((prev) => ({ ...prev, search }))}
        />
        <select
          className="mb-3 w-32 sm:pl-3"
          defaultValue=""
          onChange={(e) =>
            setQuery((prev) => ({ ...prev, role: e.target.value }))
          }
        >
          <option value="">All</option>
          {[Role.customer, Role.shipper, Role.seller].map((value) => (
            <option key={value} value={value}>
              {capitalize(value)}
            </option>
          ))}
        </select>
      </div>
      {isLoadingInitialData ? (
        <Loading.Dots />
      ) : (
        <>
          <div className="manage_table">
            <table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Id</th>
                  <ThSortOrderBy
                    query={query}
                    setQuery={setQuery}
                    target="username"
                  >
                    User Name
                  </ThSortOrderBy>
                  <ThSortOrderBy
                    query={query}
                    setQuery={setQuery}
                    target="role"
                  >
                    Role
                  </ThSortOrderBy>
                  <th>Contact</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.lstProfile.length ? (
                  data.lstProfile.map((profile, index) => (
                    <tr key={profile._id}>
                      <td>{index + 1}</td>
                      <td>{profile._id}</td>
                      <td>{profile.username}</td>
                      <td>
                        <select
                          value={profile.role}
                          onChange={(e) => handleChangeRole(e, index)}
                        >
                          {[Role.customer, Role.shipper, Role.seller].map(
                            (role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            )
                          )}
                        </select>
                      </td>
                      <td>
                        <div>Email: {profile.user.email}</div>
                        <div>Phone Number: {profile.user.phoneNumber}</div>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-2">
                          <button
                            className={`rounded-lg bg-yellow-500 px-4 py-2 duration-300 hover:bg-yellow-600`}
                            onClick={() => handleBlockUser(index)}
                          >
                            {profile.blocked ? "Unblock" : "Block"}
                          </button>
                          <button
                            className="rounded-lg bg-red-600 px-4 py-2 text-red-100 duration-300 hover:bg-red-700"
                            onClick={() => handleDeleteUser(index)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">
                      <p className="text-center">
                        No customer has resgitered our page
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            className="mt-8"
            totalPageCount={data.pageCounted}
            currentPage={query.page}
            setCurrentPage={(page) => setQuery((prev) => ({ ...prev, page }))}
          >
            <Pagination.Arrow>
              <Pagination.Number />
            </Pagination.Arrow>
          </Pagination>
        </>
      )}
    </div>
  );
}
