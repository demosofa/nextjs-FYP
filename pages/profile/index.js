import { withAuth } from "../../helpers";
import axios from "axios";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

export const getServerSideProps = withAuth(async ({ req }, role) => {
  let value = null;
  try {
    const response = await axios.get(`${LocalApi}/profile`, {
      headers: {
        Cookie: req.headers.cookie,
      },
    });
    value = response.data;
  } catch (error) {
    console.log(error.message);
  }
  return {
    props: {
      value,
      role,
    },
  };
});

export default function MyProfile({ value, role }) {
  console.log(role);
  return (
    <div>
      <div>{value.fullname}</div>
      <div>
        <div>{value.gender}</div>
        <div>{value.dateOfBirth}</div>
        <div>{value.email}</div>
        <div>{value.phoneNumber}</div>
      </div>
      <div></div>
    </div>
  );
}
