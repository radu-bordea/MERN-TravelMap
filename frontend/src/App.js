import { useState } from "react";
import ReactMapGl from "react-map-gl";

function App() {
  const [viewport, setViewport] = useState({
    width: 400,
    height: 400,
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
  });

  return (
    <div className="App">
      <ReactMapGl
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        onViewStateChange={({ viewState }) => setViewport(viewState)} // Use the correct handler
      />
    </div>
  );
}

export default App;
