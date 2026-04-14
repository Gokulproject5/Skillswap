import Footer from '@/Component/Home/Footer';
import Header from '@/Component/Home/Header';



export default function PublicLayout({ children }) {
  return (
    <>
     <Header />
     { children }
     <Footer />
    </>
  );
}