import Ably from "ably/promises";

const ablyBE = new Ably.Realtime(process.env.ABLY_API_KEY);

export default ablyBE;
