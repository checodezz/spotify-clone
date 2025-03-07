import { Button } from "react-bootstrap"
import{ FaHeart, FaRegHeart } from "react-icons/fa"
const SongList = ({getSongsToDisplay, currentSong, favorites, toggleFavorite, playSong, songs}) => {
    return (
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
    )
}

export default SongList