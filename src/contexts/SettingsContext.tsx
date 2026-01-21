import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getSetupSettings } from "../services/SetupServices";
import { applyThemeColors, updateFavicon } from "../utils/themeUtils";
import LoadingSpinner from "../Components/ui/LoadingSpinner";

type Settings = {
  companyLogo: string | null;
  themeColor: string;
  allowCompanyChange: boolean;
  favicon: string | null;
  shortcutDimCode1?: string | null;
  shortcutDimCode2?: string | null;
};

type SettingsContextType = {
  settings: Settings;
  refreshSettings: () => Promise<void>;
};

const SettingsContext = createContext < SettingsContextType | undefined > (undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState < Settings > ({
    companyLogo: null,
    themeColor: "#556ee6",
    allowCompanyChange: false,
    favicon: null,
    shortcutDimCode1: null,
    shortcutDimCode2: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getSetupSettings();
      const newSettings = {
        companyLogo: response.data.companyLogo || null,
        themeColor: response.data.themeColor || "#556ee6",
        allowCompanyChange: response.data.allowCompanyChange || false,
        favicon: response.data.favicon || null,
        shortcutDimCode1: response.data.shortcutDimCode1 || null,
        shortcutDimCode2: response.data.shortcutDimCode2 || null,
      };
      setSettings(newSettings);
      if (newSettings.themeColor) {
        applyThemeColors(newSettings.themeColor);
      }
      if (newSettings.favicon) {
        updateFavicon(newSettings.favicon);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshSettings = useCallback(async () => {
    await fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

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
