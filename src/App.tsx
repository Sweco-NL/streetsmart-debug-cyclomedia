import StreetSmart from "./components/StreetSmart";
import "./App.css";

function App() {
  return (
    <StreetSmart
      username={import.meta.env.VITE_STREETSMART_USER}
      password={import.meta.env.VITE_STREETSMART_PASSWORD}
      apiKey={import.meta.env.VITE_STREETSMART_API_KEY}
      coordinate={[202757.84, 502816.75, 0]}
      srs="EPSG:28992"
    />
  );
}

export default App;
