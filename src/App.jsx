import { useState, useEffect, useRef } from "react"
import { Container, Row, Col, Button, Navbar } from "react-bootstrap"
import { GiHamburgerMenu } from "react-icons/gi"
import "./App.scss"
import songData from "./data/songs"
import Sidebar from "./sidebar/Sidebar"
import SearchBar from "./searchbar/Searchbar"
import SongList from "./SongList/SongList"
import MusicPlayer from "./MusicPlayer/MusicPlayer"


function App() {
  const [songs, setSongs] = useState(songData)
  const [currentSongIndex, setCurrentSongIndex] = useState(3) 
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
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab}/>
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
            
            <SearchBar searchQuery={searchQuery} handleSearch={handleSearch} />

            {/* Song list */}
            <SongList getSongsToDisplay={getSongsToDisplay} currentSong={currentSong} favorites={favorites} toggleFavorite={toggleFavorite} playSong={playSong} songs={songs}/>
          </Col>

          {/* Player */}
          <MusicPlayer currentSong={currentSong} progress={progress} prevSong={prevSong} togglePlay={togglePlay} isPlaying={isPlaying} nextSong={nextSong} volume={volume} setVolume={setVolume}/>
        </Row>
      </Container>
    </div>
  )
}

export default App

