import React, { JSX, JSXElementConstructor } from "react";
import Image from "next/image";

const Header = (props:{img_url: any, name: any}) => {
    return(
        <div className='mainHeader'>
            {/* <Image src='' alt='logo'></Image> */}
            {/* <Image src={props.img_url} alt="profile_pic" width={100} height={100}></Image>
            <h1>{props.name}</h1> */}
        </div>

    );

}

export default Header;