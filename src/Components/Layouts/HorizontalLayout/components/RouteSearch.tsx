import React, { useMemo, useState, useEffect, useRef } from "react";
import { Modal, Box } from "@mui/material";
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
  const inputRef = useRef<HTMLInputElement>(null);
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

  // Auto focus when modal opens
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log(isOpen, "isOpen");
      console.log(inputRef.current, "inputRef");
      if (isOpen && inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isOpen]);

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
      open={isOpen}
      onClose={toggle}
      aria-labelledby="route-search-modal"
      BackdropProps={{
        style: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "4%",
          left: "45%",
          transform: "translate(-50%, -20%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 1,
          boxShadow: 24,
          paddingLeft: 2,
          paddingRight: 2,
          paddingTop: 1,
          paddingBottom: 1,
        }}
      >
        <div className="modal-header border-0 pb-0">
          <div className="w-100">
            <input
              ref={inputRef}
              type="text"
              className="form-control form-control-lg border-0 shadow-none"
              placeholder="Search"
              value={searchTerm}
              onChange={handleInputChange}
            />
          </div>
          <button
            type="button"
            className="btn btn-close"
            aria-label="close"
            onClick={() => {
              toggle();
              setSearchTerm("");
              setShowOptions(false);
            }}
          ></button>
        </div>
        <div className="modal-body pt-0" style={{ cursor: "pointer" }}>
          {showOptions && filteredRoutes.length > 0 && (
            <div className="position-absolute w-100 mt-1 shadow-sm bg-white rounded border">
              {filteredRoutes.map((route, index) => (
                <div
                  key={index}
                  className="p-2 list-group-item list-group-item-action border-0 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleRouteSelect(route.path)}
                >
                  <div className="d-flex align-items-center">
                    <i className="ri-navigation-line me-2 text-muted"></i>
                    <span>{route.title}</span>
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
      </Box>
    </Modal>
  );
};

export default RouteSearch;
