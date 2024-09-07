import { Moon, Sun } from "lucide-react";
import React from "react";
import useTheme from "./context/Theme.jsx";

function ThemeBtn() {
  const { themeMode, lightmode, darkmode } = useTheme();
  const onChangeBtn = () => {
    if (themeMode === "dark") lightmode();
    else darkmode();
  };

  return (
    <button
      className="relative rounded-full p-4 duration-200 hover:bg-blue-100"
      onClick={onChangeBtn}
    >
      {/* Sun Icon */}
      <Sun
        className={`h-6 w-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-in-out ${
          themeMode === "dark" ? "opacity-0 scale-0" : "opacity-100 scale-100"
        }`}
      />
      {/* Moon Icon */}
      <Moon
        className={`h-6 w-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-in-out ${
          themeMode === "dark" ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
      />
      <span className="sr-only">Toggle Theme</span>
    </button>
  );
}

export default ThemeBtn;
