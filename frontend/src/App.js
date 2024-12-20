import { useEffect, useState } from "react";
import ReactMapGl, { Marker, Popup } from "react-map-gl";
import PlaceIcon from "@mui/icons-material/Place";
import StarIcon from "@mui/icons-material/Star";
import axios from "axios";
import { format } from "timeago.js";
import "./app.css";

function App() {
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);

  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vw",
    latitude: 36.34232,
    longitude: 17.4376,
    zoom: 4,
  });

  useEffect(() => {
    const getPins = async () => {
      try {
        const response = await axios.get("/pins");
        console.log("Pins data:", response.data);
        setPins(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (id) => {
    setCurrentPlaceId(id);
  };

  return (
    <div className="App">
      <ReactMapGl
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        onViewStateChange={({ viewState }) => setViewport(viewState)} // Use the correct handler
      >
        {pins.map((p) => (
          <>
            <Marker
              latitude={p.lat}
              longitude={p.long}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <PlaceIcon
                style={{ fontSize: viewport.zoom * 7, color: "slateblue" }}
                onClick={() => handleMarkerClick(p._id)}
              />
            </Marker>
            {
              (p._id === currentPlaceId && (
                <Popup
                  latitude={p.lat}
                  longitude={p.long}
                  closeButton={true}
                  closeOnClick={false}
                  anchor="left"
                  onClose={()=> setCurrentPlaceId(null)}
                >
                  <div className="card">
                    <label>Place</label>
                    <h4 className="place">{p.title}</h4>
                    <label>Review</label>
                    <p className="desc">{p.desc}</p>
                    <label>Rating</label>
                    <label>
                      <div className="stars">
                        <StarIcon className="star" />
                        <StarIcon className="star" />
                        <StarIcon className="star" />
                        <StarIcon className="star" />
                        <StarIcon className="star" />
                      </div>
                    </label>
                    <label>Information</label>
                    <span className="username">
                      Created by <b>{p.username}</b>
                    </span>
                    <span className="date">{format(p.createdAt)}</span>
                  </div>
                </Popup>
              ))
            }
          </>
        ))}
      </ReactMapGl>
    </div>
  );
}

export default App;
