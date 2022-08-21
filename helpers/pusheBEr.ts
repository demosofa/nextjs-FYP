import Pusher from "pusher";

const pusherBE = new Pusher({
  appId: process.env.app_id,
  key: process.env.NEXT_PUBLIC_key,
  secret: process.env.secret,
  cluster: process.env.NEXT_PUBLIC_cluster,
});

export default pusherBE;
