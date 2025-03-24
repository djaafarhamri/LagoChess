import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { LineChart, BarChart, TrophyIcon, ClockIcon, UserIcon, LogOut } from "lucide-react";

const Profile: React.FC = () => {
  const { user, login, logout } = useUser();
  const [activeTab, setActiveTab] = useState("stats");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [stats, setStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0,
    gamesDrawn: 0,
    winRate: 0,
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        username: user.username,
        email: user.email,
      }));
    }
  }, [user]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          `${!import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL === "undefined" ? "" : import.meta.env.VITE_API_URL}/api/game/stats/${user?.username}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    if (user?.username) {
      fetchStats();
    }
  }, [user?.username]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        `${!import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL === "undefined" ? "" : import.meta.env.VITE_API_URL}/api/auth/update-profile`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess("Profile updated successfully");
        setIsEditing(false);
        if (data.user) {
          login(data.user);
        }
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch (err) {
      setError("An error occurred while updating your profile");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${!import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL === "undefined" ? "" : import.meta.env.VITE_API_URL}/api/auth/logout`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (response.ok) {
        logout();
      } else {
        setError("Failed to logout");
      }
    } catch (err) {
      setError("An error occurred while logging out");
    }
  };

  if (!user) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
        <div className="bg-[#2a2a2a] rounded-lg p-8 text-center">
          <h2 className="text-amber-300 text-xl mb-4">Please log in to view your profile</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="chess-game wooden">
      <div className="chess-container">
        <div className="flex flex-col md:flex-row gap-8 w-full">
          <div className="md:w-1/3">
            <div className="game-card">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4 border-2 border-amber-500/30">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt="User" />
                  <AvatarFallback className="text-2xl bg-amber-900/50 text-amber-300">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl text-amber-300">{user.username}</h2>
                <p className="text-amber-100/60">{user.email}</p>
              </div>
              <div className="mt-6">
                <div className="flex justify-center gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-100">{stats.gamesPlayed}</div>
                    <div className="text-sm text-amber-100/60">Games</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-100">{stats.winRate}%</div>
                    <div className="text-sm text-amber-100/60">Win Rate</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="game-button w-full"
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="game-button w-full bg-red-900/50 hover:bg-red-900/70 border-red-500/30"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <LogOut className="h-4 w-4" />
                      Logout
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-2/3">
            <div className="tabs">
              <div className="tab-list grid grid-cols-3 gap-1 mb-4">
                <button
                  className={`tab ${activeTab === "stats" ? "active" : ""} game-button small`}
                  onClick={() => setActiveTab("stats")}
                >
                  Statistics
                </button>
                <button
                  className={`tab ${activeTab === "games" ? "active" : ""} game-button small`}
                  onClick={() => setActiveTab("games")}
                >
                  Recent Games
                </button>
                <button
                  className={`tab ${activeTab === "achievements" ? "active" : ""} game-button small`}
                  onClick={() => setActiveTab("achievements")}
                >
                  Achievements
                </button>
              </div>

              {activeTab === "stats" && (
                <div className="game-card">
                  <div className="game-card-header">
                    <h3 className="game-card-title">Your Statistics</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <StatCard
                      title="Games"
                      value={stats.gamesPlayed.toString()}
                      description={`${stats.gamesWon} wins, ${stats.gamesLost} losses, ${stats.gamesDrawn} draws`}
                      icon={<BarChart className="h-5 w-5 text-amber-300" />}
                    />
                    <StatCard
                      title="Win Rate"
                      value={`${stats.winRate}%`}
                      description="Overall win rate"
                      icon={<LineChart className="h-5 w-5 text-amber-300" />}
                    />
                    <StatCard
                      title="Achievements"
                      value="3"
                      description="Completed achievements"
                      icon={<TrophyIcon className="h-5 w-5 text-amber-300" />}
                    />
                  </div>

                  <div className="p-4 bg-amber-900/30 rounded-lg border border-amber-500/30">
                    <h3 className="font-medium mb-2 text-amber-300">Win Rate History</h3>
                    <div className="h-40 flex items-end">
                      {/* Simulated chart bars */}
                      {[45, 52, 48, 55, 50, 57, stats.winRate].map((rate, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-amber-500/70 mx-1 rounded-t-sm"
                          style={{ height: `${rate}%` }}
                          title={`Win Rate: ${rate}%`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-amber-100/60 mt-2">
                      <span>Last 7 days</span>
                      <span>Today</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "games" && (
                <div className="game-card">
                  <div className="game-card-header">
                    <h3 className="game-card-title">Recent Games</h3>
                  </div>
                  <div className="space-y-4">
                    {/* Placeholder for recent games */}
                    <div className="text-center text-amber-100/60 py-4">
                      Recent games feature coming soon
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "achievements" && (
                <div className="game-card">
                  <div className="game-card-header">
                    <h3 className="game-card-title">Achievements</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        title: "First Victory",
                        description: "Win your first game",
                        completed: stats.gamesWon > 0,
                        icon: <TrophyIcon className="h-5 w-5 text-amber-300" />,
                      },
                      {
                        title: "Regular Player",
                        description: "Play 10 games",
                        completed: stats.gamesPlayed >= 10,
                        icon: <ClockIcon className="h-5 w-5 text-amber-300" />,
                      },
                      {
                        title: "Win Streak",
                        description: "Win 5 games in a row",
                        completed: false,
                        icon: <TrophyIcon className="h-5 w-5 text-amber-300" />,
                      },
                      {
                        title: "Social Butterfly",
                        description: "Play against 5 different opponents",
                        completed: false,
                        icon: <UserIcon className="h-5 w-5 text-amber-300" />,
                      },
                    ].map((achievement, i) => (
                      <div
                        key={i}
                        className={`p-4 border rounded-lg ${
                          achievement.completed
                            ? "border-amber-500/30 bg-amber-900/20"
                            : "border-gray-500/30 bg-gray-900/10 opacity-60"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-full ${
                              achievement.completed
                                ? "bg-amber-900/30 border border-amber-500/30"
                                : "bg-gray-900/30 border border-gray-500/30"
                            }`}
                          >
                            {achievement.icon}
                          </div>
                          <div>
                            <div className="font-medium text-amber-100">{achievement.title}</div>
                            <div className="text-sm text-amber-100/60">{achievement.description}</div>
                          </div>
                          {achievement.completed && (
                            <div className="ml-auto bg-amber-900/30 text-amber-300 rounded-full px-2 py-1 text-xs border border-amber-500/30">
                              Completed
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="game-card max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-amber-300">Edit Profile</h2>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-amber-300 hover:text-amber-400"
                >
                  ✕
                </button>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-2 rounded-lg mb-4">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-500/20 border border-green-500/50 text-green-300 px-4 py-2 rounded-lg mb-4">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-amber-100/60 mb-2">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-[#1a1a1a] border border-amber-500/20 rounded-lg text-amber-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-amber-100/60 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-[#1a1a1a] border border-amber-500/20 rounded-lg text-amber-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-amber-100/60 mb-2">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-[#1a1a1a] border border-amber-500/20 rounded-lg text-amber-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-amber-100/60 mb-2">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-[#1a1a1a] border border-amber-500/20 rounded-lg text-amber-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-amber-100/60 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-[#1a1a1a] border border-amber-500/20 rounded-lg text-amber-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  type="submit"
                  className="game-button w-full"
                >
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function StatCard({ title, value, description, icon }: { title: string, value: string, description: string, icon: React.ReactNode }) {
  return (
    <div className="p-4 border border-amber-500/30 rounded-lg bg-amber-900/20">
      <div className="flex items-center gap-2 mb-2">
        <div className="bg-amber-900/30 p-2 rounded-full border border-amber-500/30">{icon}</div>
        <h3 className="font-medium text-amber-300">{title}</h3>
      </div>
      <div className="text-2xl font-bold text-amber-100">{value}</div>
      <div className="text-sm text-amber-100/60">{description}</div>
    </div>
  );
}

export default Profile; 