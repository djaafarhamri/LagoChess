import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { Moon, Sun, Bell, Volume2, VolumeX, Timer, Eye, EyeOff } from "lucide-react";

const Settings: React.FC = () => {
  const { user } = useUser();
  const [settings, setSettings] = useState({
    theme: "dark",
    boardTheme: "wooden",
    soundEnabled: true,
    notificationsEnabled: true,
    showCoordinates: true,
    showCapturedPieces: true,
    timeControl: "10+0",
    moveConfirmation: false,
    autoQueenPromotion: true,
    showLegalMoves: true,
    showEvalBar: true,
  });

  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem("chessSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      localStorage.setItem("chessSettings", JSON.stringify(newSettings));
      return newSettings;
    });
  };

  const handleSaveSettings = async () => {
    try {
      const response = await fetch(
        `${!import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL === "undefined" ? "" : import.meta.env.VITE_API_URL}/api/user/settings`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(settings),
        }
      );

      if (response.ok) {
        setSuccess("Settings saved successfully");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError("Failed to save settings");
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      setError("An error occurred while saving settings");
      setTimeout(() => setError(null), 3000);
    }
  };

  if (!user) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
        <div className="bg-[#2a2a2a] rounded-lg p-8 text-center">
          <h2 className="text-amber-300 text-xl mb-4">Please log in to access settings</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="chess-game wooden">
      <div className="chess-container">
        <h1 className="text-3xl font-bold text-amber-300 mb-8">Settings</h1>

        {success && (
          <div className="bg-green-500/20 border border-green-500/50 text-green-300 px-4 py-2 rounded-lg mb-4">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-6">
          {/* Appearance Settings */}
          <div className="game-card flex-1 min-w-[300px]">
            <h2 className="text-xl font-bold text-amber-300 mb-4">Appearance</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-amber-100">Theme</label>
                  <p className="text-sm text-amber-100/60">Choose between light and dark mode</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSettingChange("theme", "light")}
                    className={`p-2 rounded-lg ${settings.theme === "light" ? "bg-amber-500/30 border border-amber-500/50" : "bg-gray-800/30"}`}
                  >
                    <Sun className="h-5 w-5 text-amber-300" />
                  </button>
                  <button
                    onClick={() => handleSettingChange("theme", "dark")}
                    className={`p-2 rounded-lg ${settings.theme === "dark" ? "bg-amber-500/30 border border-amber-500/50" : "bg-gray-800/30"}`}
                  >
                    <Moon className="h-5 w-5 text-amber-300" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-amber-100">Board Theme</label>
                  <p className="text-sm text-amber-100/60">Choose your preferred board appearance</p>
                </div>
                <select
                  value={settings.boardTheme}
                  onChange={(e) => handleSettingChange("boardTheme", e.target.value)}
                  className="bg-[#1a1a1a] border border-amber-500/20 rounded-lg px-3 py-2 text-amber-300"
                >
                  <option value="wooden">Wooden</option>
                  <option value="classic">Classic</option>
                  <option value="emerald">Emerald</option>
                  <option value="midnight">Midnight</option>
                </select>
              </div>
            </div>
          </div>

          {/* Game Settings */}
          <div className="game-card flex-1 min-w-[300px]">
            <h2 className="text-xl font-bold text-amber-300 mb-4">Game Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-amber-100">Default Time Control</label>
                  <p className="text-sm text-amber-100/60">Set your preferred time control</p>
                </div>
                <select
                  value={settings.timeControl}
                  onChange={(e) => handleSettingChange("timeControl", e.target.value)}
                  className="bg-[#1a1a1a] border border-amber-500/20 rounded-lg px-3 py-2 text-amber-300"
                >
                  <option value="1+0">1 minute</option>
                  <option value="3+0">3 minutes</option>
                  <option value="5+0">5 minutes</option>
                  <option value="10+0">10 minutes</option>
                  <option value="15+0">15 minutes</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-amber-100">Move Confirmation</label>
                  <p className="text-sm text-amber-100/60">Require confirmation before making moves</p>
                </div>
                <button
                  onClick={() => handleSettingChange("moveConfirmation", !settings.moveConfirmation)}
                  className={`p-2 rounded-lg ${settings.moveConfirmation ? "bg-amber-500/30 border border-amber-500/50" : "bg-gray-800/30"}`}
                >
                  {settings.moveConfirmation ? <Eye className="h-5 w-5 text-amber-300" /> : <EyeOff className="h-5 w-5 text-amber-300" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-amber-100">Auto Queen Promotion</label>
                  <p className="text-sm text-amber-100/60">Automatically promote pawns to queens</p>
                </div>
                <button
                  onClick={() => handleSettingChange("autoQueenPromotion", !settings.autoQueenPromotion)}
                  className={`p-2 rounded-lg ${settings.autoQueenPromotion ? "bg-amber-500/30 border border-amber-500/50" : "bg-gray-800/30"}`}
                >
                  {settings.autoQueenPromotion ? <Timer className="h-5 w-5 text-amber-300" /> : <Timer className="h-5 w-5 text-gray-500" />}
                </button>
              </div>
            </div>
          </div>

          {/* Display Settings */}
          <div className="game-card flex-1 min-w-[300px]">
            <h2 className="text-xl font-bold text-amber-300 mb-4">Display Options</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-amber-100">Show Coordinates</label>
                  <p className="text-sm text-amber-100/60">Display board coordinates</p>
                </div>
                <button
                  onClick={() => handleSettingChange("showCoordinates", !settings.showCoordinates)}
                  className={`p-2 rounded-lg ${settings.showCoordinates ? "bg-amber-500/30 border border-amber-500/50" : "bg-gray-800/30"}`}
                >
                  {settings.showCoordinates ? <Eye className="h-5 w-5 text-amber-300" /> : <EyeOff className="h-5 w-5 text-amber-300" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-amber-100">Show Captured Pieces</label>
                  <p className="text-sm text-amber-100/60">Display captured pieces</p>
                </div>
                <button
                  onClick={() => handleSettingChange("showCapturedPieces", !settings.showCapturedPieces)}
                  className={`p-2 rounded-lg ${settings.showCapturedPieces ? "bg-amber-500/30 border border-amber-500/50" : "bg-gray-800/30"}`}
                >
                  {settings.showCapturedPieces ? <Eye className="h-5 w-5 text-amber-300" /> : <EyeOff className="h-5 w-5 text-amber-300" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-amber-100">Show Legal Moves</label>
                  <p className="text-sm text-amber-100/60">Highlight legal moves on hover</p>
                </div>
                <button
                  onClick={() => handleSettingChange("showLegalMoves", !settings.showLegalMoves)}
                  className={`p-2 rounded-lg ${settings.showLegalMoves ? "bg-amber-500/30 border border-amber-500/50" : "bg-gray-800/30"}`}
                >
                  {settings.showLegalMoves ? <Eye className="h-5 w-5 text-amber-300" /> : <EyeOff className="h-5 w-5 text-amber-300" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-amber-100">Show Evaluation Bar</label>
                  <p className="text-sm text-amber-100/60">Display position evaluation bar</p>
                </div>
                <button
                  onClick={() => handleSettingChange("showEvalBar", !settings.showEvalBar)}
                  className={`p-2 rounded-lg ${settings.showEvalBar ? "bg-amber-500/30 border border-amber-500/50" : "bg-gray-800/30"}`}
                >
                  {settings.showEvalBar ? <Eye className="h-5 w-5 text-amber-300" /> : <EyeOff className="h-5 w-5 text-amber-300" />}
                </button>
              </div>
            </div>
          </div>

          {/* Sound & Notifications */}
          <div className="game-card flex-1 min-w-[300px]">
            <h2 className="text-xl font-bold text-amber-300 mb-4">Sound & Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-amber-100">Sound Effects</label>
                  <p className="text-sm text-amber-100/60">Enable move sounds and other effects</p>
                </div>
                <button
                  onClick={() => handleSettingChange("soundEnabled", !settings.soundEnabled)}
                  className={`p-2 rounded-lg ${settings.soundEnabled ? "bg-amber-500/30 border border-amber-500/50" : "bg-gray-800/30"}`}
                >
                  {settings.soundEnabled ? <Volume2 className="h-5 w-5 text-amber-300" /> : <VolumeX className="h-5 w-5 text-amber-300" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-amber-100">Notifications</label>
                  <p className="text-sm text-amber-100/60">Receive game invites and updates</p>
                </div>
                <button
                  onClick={() => handleSettingChange("notificationsEnabled", !settings.notificationsEnabled)}
                  className={`p-2 rounded-lg ${settings.notificationsEnabled ? "bg-amber-500/30 border border-amber-500/50" : "bg-gray-800/30"}`}
                >
                  {settings.notificationsEnabled ? <Bell className="h-5 w-5 text-amber-300" /> : <Bell className="h-5 w-5 text-gray-500" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleSaveSettings}
          className="game-button w-full mt-8"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings; 