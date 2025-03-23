import React from "react";
import Image from "next/image";
import styles from "./header.module.css"; // Import the CSS module

const Header = (props: { img_url: string; name: string }) => {
  return (
    <div className={styles.mainHeader}>
      <Image className={styles.logo} src="/logo.png" width={600} height={300} alt="Echo logo" />
      <div className={styles.headerContent}>
        <h1 className={styles.headerText}>{props.name}</h1>
        <img className={styles.profilePic} src={props.img_url} alt="profile_pic" />
      </div>
    </div>
  );
};

export default Header;