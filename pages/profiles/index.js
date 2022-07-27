import axios from "axios";

export async function getServerSideProps() {
  const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;
  const accounts = await axios
    .get(`${LocalApi}/account`)
    .then((response) => response.data);
  return {
    props: {
      accounts,
    },
  };
}

export default function AccountIndex({ accounts }) {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Id</th>
            <th>UserName</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account, index) => {
            return (
              <tr>
                <td>{index + 1}</td>
                <td>{account.id}</td>
                <td>{account.username}</td>
                <td>{account.status}</td>
                <td></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
