import Ably from "ably/promises";

async function createAblyToken(req, res) {
  const ablyBE = new Ably.Realtime(process.env.ABLY_API_KEY);
  const tokenRequest = await ablyBE.auth.createTokenRequest();
  res.status(200).json(tokenRequest);
}

export default createAblyToken;
