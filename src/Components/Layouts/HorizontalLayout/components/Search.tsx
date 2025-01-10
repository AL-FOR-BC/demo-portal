import  { useState } from "react";
import { SearchIcon } from "../../../common/icons/icons";
import RouteSearch from "./RouteSearch";

function Search() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <div>
      {/* search icon  */}
      <div className="dropdown d-none d-lg-inline-block ms-1">
        <button
          type="button"
          className="btn header-item noti-icon "
          onClick={() => {
            toggleSearch();
          }}
          data-toggle="fullscreen"
        >
          <SearchIcon fontSize={18} />
        </button>
      </div>
      <RouteSearch isOpen={isSearchOpen} toggle={toggleSearch} />
    </div>
  );
}

export default Search;
