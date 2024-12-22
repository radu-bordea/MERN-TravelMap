import "./app.css";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { useEffect, useState } from "react";
import { Room, Star, StarBorder } from "@material-ui/icons";
import axios from "axios";
import { format } from "timeago.js";

function App() {
  const myStorage = window.localStorage; // Local storage for persisting data
  const currentUser = "Florencia"; // Simulated logged-in user

  // State variables for managing pins, viewport, and form inputs
  const [pins, setPins] = useState([]); // Array of map pins
  const [currentPlaceId, setCurrentPlaceId] = useState(null); // Current pin ID for viewing details
  const [newPlace, setNewPlace] = useState(null); // Coordinates for a new pin
  const [title, setTitle] = useState(null); // Title of the new pin
  const [desc, setDesc] = useState(null); // Description of the new pin
  const [star, setStar] = useState(0); // Star rating of the new pin
  const [viewport, setViewport] = useState({
    latitude: 47.040182,
    longitude: 17.071727,
    zoom: 4,
  }); // Map viewport settings
  const [showRegister, setShowRegister] = useState(false); // Toggle for registration form
  const [showLogin, setShowLogin] = useState(false); // Toggle for login form

  // Handles clicking a marker to focus on a specific pin
  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };

  // Handles adding a new pin on the map
  const handleAddClick = (e) => {
    const [longitude, latitude] = e.lngLat;
    setNewPlace({
      lat: latitude,
      long: longitude,
    });
  };

  const handleDeleteClick = async (id) => {
    try {
      const response = await axios.delete(`/pins/${id}`);
      console.log(response.data.message); // show success message
      alert("Pin deleted successfully!");
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      alert("Failed to delete the pin.");
    }
  };

  // Submits a new pin to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating: star,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {
      const res = await axios.post("/pins", newPin); // API call to save the pin
      setPins([...pins, res.data]); // Add the new pin to the local state
      setNewPlace(null); // Reset the form
    } catch (err) {
      console.log(err);
    }
  };

  // Fetches pins from the backend on component mount
  useEffect(() => {
    const getPins = async () => {
      try {
        const allPins = await axios.get("/pins");
        setPins(allPins.data); // Set the fetched pins to state
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, [handleDeleteClick]);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {/* Map container */}
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX} // Mapbox API token
        width="100%"
        height="100%"
        transitionDuration="200"
        onViewportChange={(viewport) => setViewport(viewport)} // Handle viewport changes
        onDblClick={handleAddClick} // Add a new pin on double-click
      >
        {/* Render existing pins */}
        {pins.map((p) => (
          <>
            {/* Pin marker */}
            <Marker
              latitude={p.lat}
              longitude={p.long}
              offsetLeft={-3.5 * viewport.zoom}
              offsetTop={-7 * viewport.zoom}
            >
              <Room
                style={{
                  fontSize: 7 * viewport.zoom,
                  color: currentUser === p.username ? "tomato" : "slateblue", // Different colors for user's and others' pins
                  cursor: "pointer",
                }}
                onClick={() => handleMarkerClick(p._id, p.lat, p.long)} // Focus on pin
              />
            </Marker>

            {/* Popup for pin details */}
            {p._id === currentPlaceId && (
              <Popup
                key={p._id}
                latitude={p.lat}
                longitude={p.long}
                closeButton={true}
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}
                anchor="left"
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{p.title}</h4>
                  <label>Review</label>
                  <p className="desc">{p.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {Array(p.rating).fill(<Star className="star" />)}
                  </div>
                  <label>Information</label>
                  <span className="username">
                    Created by <b>{p.username}</b>
                  </span>
                  <span className="date">{format(p.createdAt)}</span>
                  <button className="button" onClick={() => handleDeleteClick(p._id)}>
                    DELETE
                  </button>
                </div>
              </Popup>
            )}
          </>
        ))}

        {/* Add new pin form */}
        {newPlace && (
          <>
            {/* Marker for new pin */}
            <Marker
              latitude={newPlace.lat}
              longitude={newPlace.long}
              offsetLeft={-3.5 * viewport.zoom}
              offsetTop={-7 * viewport.zoom}
            >
              <Room
                style={{
                  fontSize: 7 * viewport.zoom,
                  color: "tomato",
                  cursor: "pointer",
                }}
              />
            </Marker>
            {/* Popup for adding pin details */}
            <Popup
              latitude={newPlace.lat}
              longitude={newPlace.long}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setNewPlace(null)}
              anchor="left"
            >
              <div>
                <form onSubmit={handleSubmit}>
                  <label>Title</label>
                  <input
                    placeholder="Enter a title"
                    autoFocus
                    onChange={(e) => setTitle(e.target.value)} // Set title
                  />
                  <label>Description</label>
                  <textarea
                    placeholder="Say us something about this place."
                    onChange={(e) => setDesc(e.target.value)} // Set description
                  />
                  <label>Rating</label>
                  <select onChange={(e) => setStar(e.target.value)}>
                    {" "}
                    // Set rating
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button type="submit" className="submitButton">
                    Add Pin
                  </button>
                </form>
              </div>
            </Popup>
          </>
        )}
      </ReactMapGL>
    </div>
  );
}

export default App;
