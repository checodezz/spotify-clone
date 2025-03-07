import { Form } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({searchQuery, handleSearch}) => {
    return (
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
    )
}

export default SearchBar;