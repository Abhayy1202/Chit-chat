import React, { useContext } from "react";

const ThemeContext = React.createContext({
  themeMode: "light",
  darkmode: () => {},
  lightmode: () => {},
});

export const ThemeProvider = ThemeContext.Provider;

export default function useTheme() {
  return useContext(ThemeContext);
}
