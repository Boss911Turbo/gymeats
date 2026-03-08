import Header from "./Header";
import Footer from "./Footer";
import ChatWidget from "./ChatWidget";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
    <ChatWidget />
  </div>
);

export default Layout;
