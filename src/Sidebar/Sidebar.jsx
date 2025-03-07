import { Col } from "react-bootstrap"
import logo from "../assets/Logo.png"

const Sidebar = ({activeTab, setActiveTab}) => {
    return (
        <Col md={3} lg={2} className="sidebar">
        <div className="spotify-logo d-none d-md-flex">
          {/* <div className="spotify-circle">
            <div className="spotify-inner-circle"></div>
          </div>
          <span>Spotify</span> */}
          <img src={logo} alt="Spotify" />

        </div>

        <nav className="sidebar-nav">
          <ul>
            <li className={activeTab === "forYou" ? "active" : ""} onClick={() => setActiveTab("forYou")}>
              For You
            </li>
            <li className={activeTab === "topTracks" ? "active" : ""} onClick={() => setActiveTab("topTracks")}>
              Top Tracks
            </li>
            <li className={activeTab === "favorites" ? "active" : ""} onClick={() => setActiveTab("favorites")}>
              Favourites
            </li>
            <li
              className={activeTab === "recentlyPlayed" ? "active" : ""}
              onClick={() => setActiveTab("recentlyPlayed")}
            >
              Recently Played
            </li>
          </ul>
        </nav>

        <div className="user-profile">
          <div className="user-avatar">
          </div>
        </div>
      </Col>
    )
}

export default Sidebar