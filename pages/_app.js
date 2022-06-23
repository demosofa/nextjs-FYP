import { useMedia } from "../hooks";
import Devices from "../helpers/Devices";
import { createContext } from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import "../styles/_globals.scss";

export const Media = createContext();

function MyApp({ Component, pageProps }) {
  const device = useMedia();
  return (
    <Provider store={store}>
      <Media.Provider value={{ device, Devices }}>
        <Component {...pageProps} />
      </Media.Provider>
    </Provider>
  );
}

export default MyApp;
