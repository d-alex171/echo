import React from "react";
import Image from "next/image";
import SpotifyAuth from "./loginSpotifyButton";



export default function Header() {
    return(
        <div className='mainHeader'>
            <Image src='' alt="logo"></Image>
            <SpotifyAuth />
        </div>

    );

}