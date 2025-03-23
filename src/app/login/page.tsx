import SpotifyAuth from "../components/loginSpotifyButton";
import Image from "next/image";

const LoginPage = () => {
  return (
    <div style={{ margin: "10vh auto", width: "50%", textAlign: "center" }}>
      <Image src="/logo.png" width={600} height={300} alt="Echo logo" />
      <SpotifyAuth />
    </div>
  );
};

export default LoginPage;
