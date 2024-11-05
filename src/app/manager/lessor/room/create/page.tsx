import { Box } from "@mui/material";
import CreateRoomPage from "./CreateRoomPage";
import CreateRoomForm from "./CreateRoomForm";
import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import SimpleMap from "@/component/SimpleMap";

export default function Page() {
    const mapContainerStyle = {
        width: "100%",
        height: "400px",
    };

    const center = {
        lat: 10.8231,
        lng: 106.6297,
    };
    return (
        <Box>
            {/* <CreateRoomPage></CreateRoomPage> */}
            <CreateRoomForm />
            {/* <SimpleMap /> */}
            
        </Box>
    )
}