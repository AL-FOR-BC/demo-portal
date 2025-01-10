import { useEffect, useState } from "react";
import { useCustomIdleTimer } from "../../../hooks/useIdleTimer";
import { Modal } from "reactstrap";
import { useAppDispatch } from "../../../store/hook";
import { signOutSuccess } from "../../../store/slices/auth";
import { CheckIcon } from "../../common/icons/icons";
import appConfig from "../../../configs/navigation.config/app.config";
import { useNavigate } from "react-router-dom";

export const IdleTimerContainer = () => {
  const {
    isIdle,
    setIsIdle,
    isModalOpen,
    setIsModalOpen,
    remainingTime,
    setRemainingTime,
  } = useCustomIdleTimer();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleStayLoggedIn = () => {
    setRemainingTime(30);
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isIdle && isModalOpen) {
      const interval = setInterval(() => {
        setRemainingTime((prevRemainingTime) =>
          prevRemainingTime > 0 ? prevRemainingTime - 1 : 0
        );
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  });
  useEffect(() => {
    const interval = setInterval(() => {
      // console.log("getRemainingTime", getRemainingTime());
      // console.log("remainingTime", remainingTime);
      // console.log("isIdle", isIdle);
      // console.log("isModalOpen", isModalOpen);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  });
  useEffect(() => {
    if (remainingTime === 0) {
      dispatch(signOutSuccess());

      setIsModalOpen(false);
      setRemainingTime(30);
      setIsIdle(false);
      navigate("");
      navigate(appConfig.unAuthenticatedEntryPath);
    }
  }, [remainingTime]);
  return (
    <Modal
      isOpen={isModalOpen}
      toggle={toggleModal}
      size="sm"
      centered
      backdrop={"static"}
    >
      <div
        style={{
          padding: "16px",
          backgroundColor: "#fff8e1",
          borderBottom: "1px solid #dee2e6",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <i
            className="ri-timer-line"
            style={{
              fontSize: "24px",
              color: "#ffd43b",
            }}
          />
          <h5
            style={{
              margin: 0,
              fontSize: "1.1rem",
              color: "#495057",
            }}
          >
            Session Timeout Warning
          </h5>
        </div>
      </div>
      <div style={{ padding: "24px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          {/* Countdown Circle */}
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              backgroundColor: "#f8f9fa",
              border: "3px solid #ffd43b",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px auto",
            }}
          >
            <span
              style={{
                fontSize: "2.5rem",
                fontWeight: "bold",
                color: "#495057",
                lineHeight: 1,
              }}
            >
              {remainingTime}
            </span>
            <small style={{ color: "#6c757d", fontSize: "0.875rem" }}>
              seconds
            </small>
          </div>

          <p
            style={{
              color: "#6c757d",
              marginBottom: 0,
              lineHeight: "1.5",
            }}
          >
            Your session is about to expire due to inactivity.
            <br />
            Would you like to stay signed in?
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button
            className="btn btn-primary"
            onClick={handleStayLoggedIn}
            style={{
              padding: "8px 24px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
            }}
          >
            <CheckIcon />
            Stay Signed In
          </button>
        </div>
      </div>
    </Modal>
  );
};
