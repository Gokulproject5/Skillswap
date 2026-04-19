import Footer from "@/Component/(Private)/Footer";
import Header from "@/Component/(Private)/Header";
import Navbar from "@/Component/(Private)/Navbar";
import { Notify } from "@/Component/(Private)/Notify";
import { ReduxProvider } from "@/redux/Provider";
import ProtectRoute from "./protectRoute";
import { ContextProvider } from "@/Context/SocketContext";
import VideoCallOverlay from "@/Component/VideoCallOverlay";




export default function PrivateLayout({ children }) {
  
  return (
    <main className=" overflow-hidden">

      <ReduxProvider>
         <ProtectRoute >
           <ContextProvider>
             <Header />
             <Navbar />
             <Notify />
             <VideoCallOverlay />
             { children }
             <Footer />
           </ContextProvider>
         </ProtectRoute>
      </ReduxProvider>
    </main>
  );
}
