import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_LOCAL_URL);

export default socket;
