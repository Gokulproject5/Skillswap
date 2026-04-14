import Footer from "@/Component/(Private)/Footer";
import Header from "@/Component/(Private)/Header";
import Navbar from "@/Component/(Private)/Navbar";
import { Notify } from "@/Component/(Private)/Notify";
import { ReduxProvider } from "@/redux/Provider";
import ProtectRoute from "./protectRoute";




export default function PrivateLayout({ children }) {
  
  return (
    <main className=" overflow-hidden">

      <ReduxProvider>
         <ProtectRoute >
           <Header />
          <Navbar />
          <Notify />
          { children }
          <Footer />
         </ProtectRoute>
      </ReduxProvider>
    </main>
  );
}
