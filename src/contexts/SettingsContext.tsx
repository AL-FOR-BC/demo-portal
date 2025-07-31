import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getSetupSettings } from "../services/SetupServices";

type Settings = {
  companyLogo: string | null;
  themeColor: string;
  allowCompanyChange: boolean;
};

type SettingsContextType = {
  settings: Settings;
  refreshSettings: () => Promise<void>;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<Settings>({
    companyLogo: null,
    themeColor: "#556ee6",
    allowCompanyChange: false,
  });

  const fetchSettings = useCallback(async () => {
    try {
      const response = await getSetupSettings();
      setSettings({
        companyLogo: response.data.companyLogo || null,
        themeColor: response.data.themeColor || "#556ee6",
        allowCompanyChange: response.data.allowCompanyChange || false,
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  }, []);

  const refreshSettings = useCallback(async () => {
    await fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <SettingsContext.Provider value={{ settings, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
