import { Col, Button } from "react-bootstrap"
import { FaEllipsisH, FaStepBackward, FaStepForward,FaVolumeUp , FaVolumeMute, FaPause, FaPlay} from "react-icons/fa"
const MusicPlayer = ({currentSong, progress, prevSong, togglePlay, isPlaying, nextSong, volume, setVolume}) => {
    return (
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
              </div>
            </div>
          </Col>
    )
}

export default MusicPlayer