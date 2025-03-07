import { useState, useEffect, useRef } from "react"
import { Container, Row, Col, Form, Button, Navbar } from "react-bootstrap"
import {
  FaSearch,
  FaEllipsisH,
  FaStepBackward,
  FaStepForward,
  FaPause,
  FaPlay,
  FaVolumeMute,
  FaVolumeUp,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa"
import { GiHamburgerMenu } from "react-icons/gi"
import "./App.scss"
import songData from "./data/songs"
import logo from "./assets/Logo.png"


function App() {
  const [songs, setSongs] = useState(songData)
  const [currentSongIndex, setCurrentSongIndex] = useState(3) // Ghost Stories is selected by default
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [showSidebar, setShowSidebar] = useState(true)
  const [activeTab, setActiveTab] = useState("forYou")
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState([])
  const [recentlyPlayed, setRecentlyPlayed] = useState([])
  const [bgColor, setBgColor] = useState("rgb(25, 20, 20)")
  const audioRef = useRef(null)
  const animationRef = useRef(null)

  // Load favorites from localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites")
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }

    const storedRecentlyPlayed = sessionStorage.getItem("recentlyPlayed")
    if (storedRecentlyPlayed) {
      setRecentlyPlayed(JSON.parse(storedRecentlyPlayed))
    }

    // Set responsive sidebar
    const handleResize = () => {
      setShowSidebar(window.innerWidth > 768)
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Save favorites to localStorage when updated
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites))
  }, [favorites])

  // Save recently played to sessionStorage when updated
  useEffect(() => {
    sessionStorage.setItem("recentlyPlayed", JSON.stringify(recentlyPlayed))
  }, [recentlyPlayed])

  // Handle audio playback
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play()
        animationRef.current = requestAnimationFrame(updateProgress)
      } else {
        audioRef.current.pause()
        cancelAnimationFrame(animationRef.current)
      }
    }

    // Update background color based on current song
    const currentSong = songs[currentSongIndex]
    if (currentSong) {
      // This is a simplified version - in a real app, you'd extract colors from the image
      if (currentSong.title === "Ghost Stories") {
        setBgColor("rgb(25, 50, 80)")
      } else if (currentSong.title === "Starboy") {
        setBgColor("rgb(80, 25, 25)")
      } else if (currentSong.title.includes("Demons")) {
        setBgColor("rgb(50, 25, 50)")
      } else {
        setBgColor("rgb(25, 20, 20)")
      }
    }

    return () => cancelAnimationFrame(animationRef.current)
  }, [isPlaying, currentSongIndex, songs])

  // Update progress bar
  const updateProgress = () => {
    if (audioRef.current) {
      const duration = audioRef.current.duration
      const currentTime = audioRef.current.currentTime
      if (duration) {
        setProgress((currentTime / duration) * 100)
      }
      animationRef.current = requestAnimationFrame(updateProgress)
    }
  }

  // Play a song
  const playSong = (index) => {
    // Add to recently played
    const songToPlay = songs[index]
    const newRecentlyPlayed = [songToPlay, ...recentlyPlayed.filter((song) => song.title !== songToPlay.title)].slice(
      0,
      10,
    )
    setRecentlyPlayed(newRecentlyPlayed)

    setCurrentSongIndex(index)
    setIsPlaying(true)
  }

  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  // Skip to next song
  const nextSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length)
    setIsPlaying(true)
  }

  // Skip to previous song
  const prevSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length)
    setIsPlaying(true)
  }

  // Set volume
  const handleVolumeChange = (e) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  // Toggle favorite
  const toggleFavorite = (song) => {
    if (favorites.some((fav) => fav.title === song.title)) {
      setFavorites(favorites.filter((fav) => fav.title !== song.title))
    } else {
      setFavorites([...favorites, song])
    }
  }

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  // Filter songs based on search query
  const filteredSongs = songs.filter((song) => song.title.toLowerCase().includes(searchQuery.toLowerCase()))

  // Get current song
  const currentSong = songs[currentSongIndex]

  // Get songs to display based on active tab
  const getSongsToDisplay = () => {
    switch (activeTab) {
      case "favorites":
        return favorites
      case "recentlyPlayed":
        return recentlyPlayed
      default:
        return filteredSongs
    }
  }

  return (
    <div className="app-container" style={{ background: `linear-gradient(to bottom, ${bgColor}, #000000)` }}>
      <audio ref={audioRef} src={currentSong?.musicUrl} onEnded={nextSong} onLoadedMetadata={updateProgress} />

      <Container fluid className="h-100">
        <Row className="h-100">
          {/* Mobile navbar */}
          <Navbar bg="transparent" variant="dark" className="d-md-none">
            <Button variant="transparent" className="menu-button" onClick={() => setShowSidebar(!showSidebar)}>
              <GiHamburgerMenu />
            </Button>
            <Navbar.Brand>
              <div className="spotify-logo">
                <div className="spotify-circle">
                  <div className="spotify-inner-circle"></div>
                </div>
                <span>Spotify</span>
              </div>
            </Navbar.Brand>
          </Navbar>

          {/* Sidebar */}
          {showSidebar && (
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
                <div className="user-avatar"></div>
              </div>
            </Col>
          )}

          {/* Main content */}
          <Col md={showSidebar ? 5 : 8} lg={showSidebar ? 6 : 8} className="main-content">
            <h1>
              {activeTab === "forYou"
                ? "For You"
                : activeTab === "topTracks"
                  ? "Top Tracks"
                  : activeTab === "favorites"
                    ? "Favourites"
                    : "Recently Played"}
            </h1>

            {/* Search bar */}
            <div className="search-container">
              <Form.Control
                type="text"
                placeholder="Search Song, Artist"
                value={searchQuery}
                onChange={handleSearch}
                className="search-input"
              />
              <FaSearch className="search-icon" />
            </div>

            {/* Song list */}
            <div className="song-list">
              {getSongsToDisplay().map((song, index) => (
                <div
                  key={index}
                  className={`song-item ${currentSong?.title === song.title ? "active" : ""}`}
                  onClick={() => playSong(songs.findIndex((s) => s.title === song.title))}
                >
                  <div className="song-thumbnail">
                    <img src={song.thumbnail || "/placeholder.svg"} alt={song.title} />
                  </div>
                  <div className="song-info">
                    <h3>{song.title}</h3>
                    <p>{song.artistName}</p>
                  </div>
                  <div className="song-actions">
                    <span className="song-duration">{song.duration}</span>
                    <Button
                      variant="transparent"
                      className="more-options"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(song)
                      }}
                    >
                      {favorites.some((fav) => fav.title === song.title) ? (
                        <FaHeart className="favorite-icon active" />
                      ) : (
                        <FaRegHeart className="favorite-icon" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Col>

          {/* Player */}
          <Col md={4} lg={4} className="player-container">
            <div className="now-playing">
              <h2>{currentSong?.title}</h2>
              <p>{currentSong?.artistName}</p>
            </div>

            <div className="album-cover">
              <img src={currentSong?.thumbnail || "/placeholder.svg"} alt={currentSong?.title} />
            </div>

            <div className="progress-container">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
            </div>

            <div className="player-controls">
              <Button variant="transparent" className="more-options">
                <FaEllipsisH />
              </Button>

              <div className="main-controls">
                <Button variant="transparent" onClick={prevSong}>
                  <FaStepBackward />
                </Button>
                <Button variant="light" className="play-pause-btn" onClick={togglePlay}>
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </Button>
                <Button variant="transparent" onClick={nextSong}>
                  <FaStepForward />
                </Button>
              </div>

              <div className="volume-control">
                <Button variant="transparent" onClick={() => setVolume(volume > 0 ? 0 : 0.7)}>
                  {volume > 0 ? <FaVolumeUp /> : <FaVolumeMute />}
                </Button>
                {/* <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="volume-slider d-none d-md-block"
                /> */}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default App

