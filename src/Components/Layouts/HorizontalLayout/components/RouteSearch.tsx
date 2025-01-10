import React, { useMemo, useState } from "react";
import { Modal } from "reactstrap";
import { useNavigate } from "react-router-dom";
import appRoutes from "../../../../routes/routes.configs/appRoutes";
// interface SearchResult {
//   key: string;
//   path: string;
//   title: string;
// }

interface RouteSearchProps {
  isOpen: boolean;
  toggle: () => void;
}

const RouteSearch: React.FC<RouteSearchProps> = ({ isOpen, toggle }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();
  const searchableRoutes = useMemo(() => {
    return appRoutes
      .filter((route) => !route.path.includes(":"))
      .map((route) => ({
        key: route.key,
        path: route.path,
        title: route.key
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
      }));
  }, []);
  const filteredRoutes = useMemo(() => {
    return searchableRoutes.filter((route) =>
      route.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchableRoutes, searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowOptions(value.length > 0);
  };
  const handleRouteSelect = (path: string) => {
    navigate(path);
    toggle();
    setSearchTerm("");
    setShowOptions(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      className="route-search-modal"
      backdrop="static"
    >
      <div className="modal-header border-0">
        <div className="w-100">
          <input
            type="text"
            className="form-control form-control-lg border-0 shadow-none"
            placeholder="Search"
            value={searchTerm}
            autoFocus
            onChange={handleInputChange}
          />
        </div>
        <button
          type="button"
          className="btn btn-close"
          arial-label="close"
          onClick={() => {
            toggle();
            setSearchTerm("");
            setShowOptions(false);
          }}
        ></button>
      </div>
      <div className="modal-body">
        {showOptions && filteredRoutes.length > 0 && (
          <div className="position-absolute w-100 mt-1 shadow-sm bg-white rounded border cursor-pointer">
            {filteredRoutes.map((route) => (
              <div
                key={route.key}
                className="p-2 list-group-item list-group-item-action border-0 cursor-pointer"
                onClick={() => handleRouteSelect(route.path)}
              >
                <div className="d-flex align-items-center cursor-pointer">
                  <i className="ri-navigation-line me-2 text-muted"></i>
                  <span className="cursor-pointer">{route.title}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {(!showOptions || filteredRoutes.length === 0) && searchTerm && (
        <div className="modal-body text-center py-4 text-muted">
          <i className="ri-search-line display-4 mb-3"></i>
          <p>No results found</p>
        </div>
      )}
    </Modal>
  );
};

export default RouteSearch;
