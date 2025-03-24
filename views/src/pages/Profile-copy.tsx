"use client"

import { ReactNode, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { LineChart, BarChart, PieChart, TrophyIcon, ClockIcon, UserIcon } from "lucide-react"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("stats")
  const [stats] = useState({
    rating: 1820,
    gamesPlayed: 248,
    wins: 142,
    losses: 89,
    draws: 17,
    puzzlesSolved: 347,
    puzzleRating: 1950,
    winRate: 57,
  })

  return (
    <div className="chess-game wooden">
      <div className="chess-container">
        <div className="flex flex-col md:flex-row gap-8 w-full">
          <div className="md:w-1/3">
            <div className="game-card">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4 border-2 border-amber-500/30">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt="User" />
                  <AvatarFallback className="text-2xl bg-amber-900/50 text-amber-300">U</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl text-amber-300">Chess Player</h2>
                <p className="text-amber-100/60">player@example.com</p>
              </div>
              <div className="mt-6">
                <div className="flex justify-center gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-100">{stats.rating}</div>
                    <div className="text-sm text-amber-100/60">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-100">{stats.gamesPlayed}</div>
                    <div className="text-sm text-amber-100/60">Games</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-100">{stats.winRate}%</div>
                    <div className="text-sm text-amber-100/60">Win Rate</div>
                  </div>
                </div>
                <button className="game-button w-full">Edit Profile</button>
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
                      description={`${stats.wins} wins, ${stats.losses} losses, ${stats.draws} draws`}
                      icon={<BarChart className="h-5 w-5 text-amber-300" />}
                    />
                    <StatCard
                      title="Rating"
                      value={stats.rating.toString()}
                      description="Classical rating"
                      icon={<LineChart className="h-5 w-5 text-amber-300" />}
                    />
                    <StatCard
                      title="Puzzles"
                      value={stats.puzzleRating.toString()}
                      description={`${stats.puzzlesSolved} puzzles solved`}
                      icon={<PieChart className="h-5 w-5 text-amber-300" />}
                    />
                  </div>

                  <div className="p-4 bg-amber-900/30 rounded-lg border border-amber-500/30">
                    <h3 className="font-medium mb-2 text-amber-300">Rating History</h3>
                    <div className="h-40 flex items-end">
                      {/* Simulated chart bars */}
                      {[1750, 1780, 1820, 1790, 1810, 1830, 1820].map((rating, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-amber-500/70 mx-1 rounded-t-sm"
                          style={{ height: `${(rating - 1700) / 2}%` }}
                          title={`Rating: ${rating}`}
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
                    {[
                      { opponent: "Magnus89", result: "Win", rating: "+8", date: "Today", time: "10:15" },
                      { opponent: "ChessMaster42", result: "Loss", rating: "-12", date: "Today", time: "09:30" },
                      { opponent: "KnightRider", result: "Win", rating: "+7", date: "Yesterday", time: "18:45" },
                      { opponent: "QueenGambit", result: "Draw", rating: "+0", date: "Yesterday", time: "15:20" },
                      { opponent: "PawnStars", result: "Win", rating: "+10", date: "2 days ago", time: "20:10" },
                    ].map((game, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 border border-amber-500/30 rounded-lg hover:bg-amber-900/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border border-amber-500/30">
                            <AvatarFallback className="bg-amber-900/50 text-amber-300">
                              {game.opponent.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-amber-100">{game.opponent}</div>
                            <div className="text-xs text-amber-100/60">
                              {game.date} at {game.time}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div
                            className={`px-2 py-1 rounded text-xs ${
                              game.result === "Win"
                                ? "bg-green-900/50 text-green-300 border border-green-500/30"
                                : game.result === "Loss"
                                  ? "bg-red-900/50 text-red-300 border border-red-500/30"
                                  : "bg-amber-900/50 text-amber-300 border border-amber-500/30"
                            }`}
                          >
                            {game.result}
                          </div>
                          <div
                            className={`text-sm ${
                              game.rating.startsWith("+") && game.rating !== "+0"
                                ? "text-green-500"
                                : game.rating.startsWith("-")
                                  ? "text-red-500"
                                  : "text-amber-100/60"
                            }`}
                          >
                            {game.rating}
                          </div>
                          <button className="game-button small">Analyze</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="game-button w-full mt-4">View All Games</button>
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
                        completed: true,
                        icon: <TrophyIcon className="h-5 w-5 text-amber-300" />,
                      },
                      {
                        title: "Puzzle Master",
                        description: "Solve 100 puzzles",
                        completed: true,
                        icon: <PieChart className="h-5 w-5 text-amber-300" />,
                      },
                      {
                        title: "Marathon Player",
                        description: "Play 10 games in a day",
                        completed: true,
                        icon: <ClockIcon className="h-5 w-5 text-amber-300" />,
                      },
                      {
                        title: "Rating Milestone",
                        description: "Reach 1800 rating",
                        completed: true,
                        icon: <LineChart className="h-5 w-5 text-amber-300" />,
                      },
                      {
                        title: "Social Butterfly",
                        description: "Add 5 friends",
                        completed: false,
                        icon: <UserIcon className="h-5 w-5 text-amber-300" />,
                      },
                      {
                        title: "Grandmaster",
                        description: "Reach 2200 rating",
                        completed: false,
                        icon: <TrophyIcon className="h-5 w-5 text-amber-300" />,
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
      </div>
    </div>
  )
}

function StatCard({ title, value, description, icon }: { title: string, value: string, description: string, icon: ReactNode }) {
  return (
    <div className="p-4 border border-amber-500/30 rounded-lg bg-amber-900/20">
      <div className="flex items-center gap-2 mb-2">
        <div className="bg-amber-900/30 p-2 rounded-full border border-amber-500/30">{icon}</div>
        <h3 className="font-medium text-amber-300">{title}</h3>
      </div>
      <div className="text-2xl font-bold text-amber-100">{value}</div>
      <div className="text-sm text-amber-100/60">{description}</div>
    </div>
  )
}

