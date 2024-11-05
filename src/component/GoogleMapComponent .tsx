'use client'
import { useState } from 'react';
import { 
    GoogleMap, 
    LoadScript, 
    Marker,
    Autocomplete
} from '@react-google-maps/api';

interface Location {
    lat: number;
    lng: number;
}

interface AddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
}

interface Place {
    address_components: AddressComponent[];
    formatted_address: string;
    geometry: {
        location: {
            lat: () => number;
            lng: () => number;
        }
    }
}

const GoogleMapComponent = () => {
    const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
    const [address, setAddress] = useState('');
    const [locationDetails, setLocationDetails] = useState<{
        city: string;
        district: string;
        ward: string;
        street: string;
    } | null>(null);

    // Lấy vị trí hiện tại
    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setCurrentLocation(location);
                    // Reverse geocoding để lấy địa chỉ từ tọa độ
                    reverseGeocode(location);
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    // Reverse geocoding
    const reverseGeocode = async (location: Location) => {
        const geocoder = new google.maps.Geocoder();
        
        try {
            const response = await geocoder.geocode({ location });
            if (response.results[0]) {
                parseAddressComponents(response.results[0].address_components);
                setAddress(response.results[0].formatted_address);
            }
        } catch (error) {
            console.error("Reverse geocoding error:", error);
        }
    };

    // Parse address components
    const parseAddressComponents = (components: AddressComponent[]) => {
        let details = {
            city: '',
            district: '',
            ward: '',
            street: ''
        };

        components.forEach(component => {
            if (component.types.includes('administrative_area_level_1')) {
                details.city = component.long_name;
            }
            if (component.types.includes('administrative_area_level_2')) {
                details.district = component.long_name;
            }
            if (component.types.includes('administrative_area_level_3')) {
                details.ward = component.long_name;
            }
            if (component.types.includes('route')) {
                details.street = component.long_name;
            }
        });

        setLocationDetails(details);
    };

    // Xử lý khi chọn địa điểm từ Autocomplete
    const handlePlaceSelect = (place: Place) => {
        if (place.geometry) {
            const location = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            };
            setCurrentLocation(location);
            parseAddressComponents(place.address_components);
            setAddress(place.formatted_address);
        }
    };

    return (
        <LoadScript
            googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY"
            libraries={['places']}
        >
            <div className="w-full max-w-4xl mx-auto p-4">
                <div className="mb-4">
                    <button 
                        onClick={getCurrentLocation}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Lấy vị trí hiện tại
                    </button>
                </div>

                <div className="mb-4">
                    <Autocomplete
                        onLoad={(autocomplete) => {
                            autocomplete.setFields(['address_components', 'geometry', 'formatted_address']);
                        }}
                        onPlaceChanged={() => {
                            const autocomplete = document.querySelector('input') as HTMLInputElement;
                            if (autocomplete) {
                                const place = autocomplete.value;
                                // Handle place selection
                            }
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Tìm kiếm địa điểm"
                            className="w-full p-2 border rounded"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </Autocomplete>
                </div>

                {currentLocation && (
                    <>
                        <GoogleMap
                            center={currentLocation}
                            zoom={15}
                            mapContainerStyle={{
                                width: '100%',
                                height: '400px'
                            }}
                        >
                            <Marker position={currentLocation} />
                        </GoogleMap>

                        {locationDetails && (
                            <div className="mt-4">
                                <h3 className="font-bold">Chi tiết địa điểm:</h3>
                                <p>Thành phố: {locationDetails.city}</p>
                                <p>Quận/Huyện: {locationDetails.district}</p>
                                <p>Phường/Xã: {locationDetails.ward}</p>
                                <p>Đường: {locationDetails.street}</p>
                                <p>Địa chỉ đầy đủ: {address}</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </LoadScript>
    );
};

export default GoogleMapComponent;