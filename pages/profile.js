import axios from "axios";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

export async function getServerSideProps() {
  const response = await axios.get(`${LocalApi}/profile`, {
    headers: {
      Authorization: `Bearer ${JSON.parse(
        localStorage.getItem("accessToken")
      )}`,
    },
  });
  const profile = await response.data;
  return {
    props: {
      profile,
    },
  };
}

export default function Profile({ profile }) {}
