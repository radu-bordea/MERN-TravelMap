import { useState } from "react";
import ReactMapGl, { Marker } from "react-map-gl";
import PlaceIcon from "@mui/icons-material/Place";

function App() {
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vw",
    latitude: 36.34232,
    longitude: 17.4376,
    zoom: 4,
  });

  return (
    <div className="App">
      <ReactMapGl
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        onViewStateChange={({ viewState }) => setViewport(viewState)} // Use the correct handler
      >
        <Marker
          latitude={48.858093}
          longitude={2.295694}
          offsetLeft={-20}
          offsetTop={-10}
        >
          <PlaceIcon style={{fontSize:viewport.zoom * 7, color:"slateblue"}}/>
        </Marker>
      </ReactMapGl>
    </div>
  );
}

export default App;
