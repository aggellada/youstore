import React from "react";
import { THEMES } from "../constants/themes";
import { useThemeStore } from "../../store/useThemeStore";

function SettingsPage() {
  const { theme, changeTheme } = useThemeStore();
  return (
    <div className="px-8 md:px-12 xl:px-0 mx-auto w-full min-h-screen max-w-5xl pt-20 flex flex-col gap-2">
      <h1 className="font-bold text-3xl">Theme</h1>
      <h3 className="font-semibold text-md">Choose a theme for your interface</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-full">
        {THEMES.map((t) => (
          <button
            className={`p-4 rounded-xl flex flex-col gap-2 hover:cursor-pointer hover:bg-base-300 transition ease-in bg-base-200/40 ${
              theme === t ? "bg-base-300" : "bg-base-200/40"
            }`}
            key={t}
            onClick={() => changeTheme(t)}
          >
            <div
              data-theme={t}
              className={`grid grid-cols-4 gap-2 ${theme === t ? "bg-base-300" : "bg-transparent"}`}
            >
              <div className="bg-primary rounded-xl p-2"></div>
              <div className="bg-secondary rounded-xl p-2"></div>
              <div className="bg-accent rounded-xl p-2"></div>
              <div className="bg-neutral rounded-xl p-2"></div>
            </div>
            <h1 className="text-center truncate text-[11px] font-medium">
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </h1>
          </button>
        ))}
      </div>
    </div>
  );
}

export default SettingsPage;
