const SYSTEM_CONFIG_SESSION_KEY = "system_config_session";
const SYSTEM_CONFIG_SESSION_DURATION = 30 * 60 * 1000;

export const setSystemConfigSession = () => {
  const sessionData = {
    timestamp: Date.now(),
    expiry: Date.now() + SYSTEM_CONFIG_SESSION_DURATION,
  };
  sessionStorage.setItem(SYSTEM_CONFIG_SESSION_KEY, JSON.stringify(sessionData));
};

export const isSystemConfigSessionActive = (): boolean => {
  try {
    const sessionData = sessionStorage.getItem(SYSTEM_CONFIG_SESSION_KEY);
    if (!sessionData) return false;

    const session = JSON.parse(sessionData);
    const now = Date.now();

    if (now > session.expiry) {
      clearSystemConfigSession();
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

export const clearSystemConfigSession = () => {
  sessionStorage.removeItem(SYSTEM_CONFIG_SESSION_KEY);
};

export const getSystemConfigSessionTimeRemaining = (): number => {
  try {
    const sessionData = sessionStorage.getItem(SYSTEM_CONFIG_SESSION_KEY);
    if (!sessionData) return 0;

    const session = JSON.parse(sessionData);
    const remaining = session.expiry - Date.now();
    return Math.max(0, remaining);
  } catch {
    return 0;
  }
};
