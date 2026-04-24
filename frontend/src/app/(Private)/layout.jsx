import Footer from "@/Component/(Private)/Footer";
import Header from "@/Component/(Private)/Header";
import Navbar from "@/Component/(Private)/Navbar";
import { Notify } from "@/Component/(Private)/Notify";
import VideoCallOverlay from "@/Component/VideoCallOverlay";
import { ContextProvider as SocketProvider } from "@/Context/SocketContext";
import ProtectRoute from "./protectRoute";




export default function PrivateLayout({ children }) {

  return (
    <main className=" overflow-hidden">
      <SocketProvider>
        <ProtectRoute>
        <Header />
        <Navbar />
        <Notify />
        <VideoCallOverlay />
        {children}
        <Footer />
        </ProtectRoute>
      </SocketProvider>
    </main>
  );
}
