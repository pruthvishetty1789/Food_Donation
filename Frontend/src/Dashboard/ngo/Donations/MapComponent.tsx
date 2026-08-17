import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapComponentProps {
  origin: string;
  destination: string;
}

interface Coordinate {
  lat: number;
  lng: number;
}

const donorIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const ngoIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapComponent({ origin, destination }: MapComponentProps) {
  const [originCoords, setOriginCoords] = useState<Coordinate | null>(null);
  const [destinationCoords, setDestinationCoords] =
    useState<Coordinate | null>(null);

  const [routePoints, setRoutePoints] = useState<[number, number][]>([]);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
    // -------------------------------
  // Convert Address → Coordinates
  // -------------------------------
  const getCoordinates = async (
  address: string
): Promise<Coordinate | null> => {
  try {
    console.log("Searching:", address);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}`
    );

    const data = await response.json();

    console.log("Response:", data);

    if (!data || data.length === 0) {
      console.log("Address not found:", address);
      return null;
    }

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  } catch (err) {
    console.error(err);
    return null;
  }
};

  // -------------------------------
  // Calculate Route using OSRM
  // -------------------------------
  const calculateRoute = async (
    originLocation: Coordinate,
    destinationLocation: Coordinate
  ) => {
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${originLocation.lng},${originLocation.lat};${destinationLocation.lng},${destinationLocation.lat}?overview=full&geometries=geojson`
      );

      const data = await response.json();

      if (!data.routes || data.routes.length === 0) {
        console.error("No route found");
        return;
      }

      const route = data.routes[0];

      const coordinates = route.geometry.coordinates.map(
        (point: number[]) => [point[1], point[0]]
      );

      setRoutePoints(coordinates);

      setDistance((route.distance / 1000).toFixed(2) + " km");

      setDuration(Math.round(route.duration / 60) + " mins");
    } catch (error) {
      console.error("Error calculating route:", error);
    }
  };

  // -------------------------------
  // Load Origin & Destination
  // -------------------------------
 useEffect(() => {
  const loadMap = async () => {
    console.log("================================");
    console.log("Origin:", origin);
    console.log("Destination:", destination);

    if (!origin || !destination) {
      console.log("Origin or destination is empty");
      return;
    }

    const originData = await getCoordinates(origin);
    console.log("Origin Coordinates:", originData);

    const destinationData = await getCoordinates(destination);
    console.log("Destination Coordinates:", destinationData);

    if (!originData || !destinationData) {
      console.log("Coordinates not found");
      return;
    }

    setOriginCoords(originData);
    setDestinationCoords(destinationData);

    await calculateRoute(originData, destinationData);
  };

  loadMap();
}, [origin, destination]);

    // -------------------------------
  // Loading State
  // -------------------------------
  if (!originCoords || !destinationCoords) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-gray-100 rounded-lg">
        <p className="text-lg font-medium">Loading Map...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-lg">

      <MapContainer
        center={[originCoords.lat, originCoords.lng]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%" }}
      >

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Donor Marker */}
        <Marker
          position={[originCoords.lat, originCoords.lng]}
          icon={donorIcon}
        >
          <Popup>
            <strong>Donor Location</strong>
            <br />
            {origin}
          </Popup>
        </Marker>

        {/* NGO Marker */}
        <Marker
          position={[destinationCoords.lat, destinationCoords.lng]}
          icon={ngoIcon}
        >
          <Popup>
            <strong>NGO Location</strong>
            <br />
            {destination}
          </Popup>
        </Marker>

        {/* Route */}
        {routePoints.length > 0 && (
          <Polyline
            positions={routePoints}
            pathOptions={{
              color: "blue",
              weight: 5,
            }}
          />
        )}

      </MapContainer>

      {/* Distance & Duration */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 z-[1000]">
        <p className="font-semibold">
          Distance: <span className="font-normal">{distance}</span>
        </p>

        <p className="font-semibold">
          Duration: <span className="font-normal">{duration}</span>
        </p>
      </div>

    </div>
  );
}
export default MapComponent;