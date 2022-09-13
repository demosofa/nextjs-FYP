import Ably from "ably/promises";
import { useMemo, useEffect } from "react";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;
const ablyFE = new Ably.Realtime.Promise({
  authUrl: `${LocalApi}/createAblyToken`,
});

export default function useAblyChannel(channelName, callbackOnMessage) {
  const channel = useMemo(
    () => ablyFE.channels.get(channelName),
    [channelName]
  );
  useEffect(() => {
    channel.subscribe((msg) => {
      callbackOnMessage(msg);
    });
    return () => channel.unsubscribe();
  }, [channelName]);

  return [channel, ablyFE];
}
