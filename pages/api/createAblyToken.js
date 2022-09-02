import Ably from "ably/promises";
import { isAuthentication } from "../../helpers";

async function createAblyToken(req, res) {
  const ablyBE = new Ably.Realtime(process.env.ABLY_API_KEY);
  const tokenRequest = await ablyBE.auth.createTokenRequest({
    clientId: req.user.id,
  });
  res.status(200).json(tokenRequest);
}

export default isAuthentication(createAblyToken);
