import { Outlet } from "react-router";
import Header from "./Header/Header.jsx";
import Footer from "./Footer/Footer.jsx";
import "./Layout.css";

function Layout() {
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <Header />
        </div>
      </div>

      <div className="row">
        <main className="col">
          <Outlet />
        </main>
      </div>

      <div className="row">
        <div className="col">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Layout;