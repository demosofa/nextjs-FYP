import { auth } from "../../../controllers";

async function logout(req, res) {
  switch (req.method.toLowerCase()) {
    case "post":
      await auth.logout(req, res);
      break;
  }
}

export default logout;
