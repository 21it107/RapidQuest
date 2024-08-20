import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

const GeographicalDistributionChart = () => {
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/customers/geographical-distribution')
            .then((response) => {
                const data = response.data.map(location => ({
                    position: [location.latitude, location.longitude],  // Assuming latitude and longitude are available
                    count: location.count,
                    city: location.city
                }));
                setLocations(data);
            })
            .catch((error) => {
                console.error('Error fetching geographical distribution data:', error);
            });
    }, []);

    return (
        <div>
            <h2>Geographical Distribution of Customers</h2>
            <MapContainer center={[51.505, -0.09]} zoom={2} style={{ height: "500px", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {locations.map((location, index) => (
                    <Marker key={index} position={location.position}>
                        <Popup>
                            {location.city}: {location.count} customers
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default GeographicalDistributionChart;