import axios from "axios";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

export async function getServerSideProps() {
  const response = await axios.get(`${LocalApi}/`);
  const profile = await response.data;
  return {
    props: {
      profile,
    },
  };
}
