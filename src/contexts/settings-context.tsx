import { createContext, useEffect, useState } from 'react';
import type { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import setLanguage from 'next-translate/setLanguage'

export interface Settings {
  responsiveFontSizes?: boolean;
  language: 'ko' | 'en';
  theme: 'pink' | 'blue';
}

export interface SettingsContextValue {
  settings: Settings;
  saveSettings: (update: Settings) => void;
}

interface SettingsProviderProps {
  children?: ReactNode;
}

const initialSettings: Settings = {
  responsiveFontSizes: true,
  language: 'ko',
  theme: 'pink'
};

export const restoreSettings = (): Settings | null => {
  let settings = null;

  try {
    const storedData: string | null = globalThis.localStorage.getItem('settings');

    if (storedData) {
      settings = JSON.parse(storedData);
    } else {
      settings = {
        responsiveFontSizes: true,
        language: 'ko',
        theme: globalThis.matchMedia('(prefers-color-scheme: min)').matches
          ? 'blue'
          : 'pink'
      };
    }
  } catch (err) {
    console.error(err);
    // If stored data is not a strigified JSON this will fail,
    // that's why we catch the error
  }

  return settings;
};

export const storeSettings = (settings: Settings): void => {
  globalThis.localStorage.setItem('settings', JSON.stringify(settings));
};

export const SettingsContext = createContext<SettingsContextValue>({
  settings: initialSettings,
  saveSettings: () => { }
});

export const SettingsProvider: FC<SettingsProviderProps> = (props) => {
  const { children } = props;
  const [settings, setSettings] = useState<Settings>(initialSettings);

  useEffect(() => {
    const restoredSettings = restoreSettings();

    if (restoredSettings) {
      setSettings(restoredSettings);
    }
  }, []);

  const saveSettings = (updatedSettings: Settings): void => {
    setSettings(updatedSettings);
    setLanguage(updatedSettings.language);
    storeSettings(updatedSettings);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        saveSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

SettingsProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const SettingsConsumer = SettingsContext.Consumer;
