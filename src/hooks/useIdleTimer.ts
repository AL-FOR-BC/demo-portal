import { useIdleTimer } from "react-idle-timer";
import { useAppSelector } from "../store/hook";
import { useState } from "react";

const IDLE_TIMEOUT = 1000 * 60 * 15; // 15 minutes
const WARNING_TIME = 1000 * 60 * 1; // 1 minutes

export const useCustomIdleTimer = () => {
  const [isIdle, setIsIdle] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [remainingTime, setRemainingTime] = useState(30);
  const { signedIn } = useAppSelector((state) => state.auth.session);

  const onIdle = () => {
    if (signedIn) {
      setIsIdle(true);
      setIsModalOpen(true);
      //   dispatch(signOutSuccess());
    }
  };
  const onActive = () => {
    if (signedIn) {
      // refrest token
    }
  };

  const onPrompt = () => {
    if (signedIn) {
      setIsIdle(true);
      setIsModalOpen(true);
    }
    // alert("You will be logged out de to inaactivity in 1 minute");
  };

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: IDLE_TIMEOUT,
    onIdle, //? this will be called when the user is idle
    onActive, //? this will be called when the user is active
    onPrompt, //! this will be called when the user is idle
    promptTimeout: WARNING_TIME,
    // throttle: 500,
    debounce: 500,
  });
  return {
    getRemainingTime,
    getLastActiveTime,
    isIdle,
    setIsIdle,
    isModalOpen,
    setIsModalOpen,
    remainingTime,
    setRemainingTime,
  };
};
