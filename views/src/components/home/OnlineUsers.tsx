import { useUser } from "../../context/UserContext";

type Props = {
  users: string[];
  setOpponant: React.Dispatch<React.SetStateAction<string>>;
  setIsChallengePopUpOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sentChallengeUsername: string;
};

function OnlineUsers({
  users,
  setOpponant,
  setIsChallengePopUpOpen,
  sentChallengeUsername,
}: Props) {
  const { user } = useUser();

  return (
    <div className="game-card">
      <div className="game-card-header">
        <h2 className="game-card-title">Online Users</h2>
      </div>
      
      {users.length === 0 ? (
        <div className="text-center p-6 text-[#f0f0f0]">
          No users are online
        </div>
      ) : (
        <div className="divide-y divide-[rgba(255,215,0,0.1)]">
          {users.map((op) =>
            user?.username !== op ? (
              <div
                key={op}
                className="flex items-center justify-between p-4 hover:bg-[rgba(139,69,19,0.2)] transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[rgba(255,215,0,0.2)] flex items-center justify-center border border-[rgba(255,215,0,0.3)]">
                    {op[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[#ffd700] font-medium">{op}</p>
                    <p className="text-sm text-[rgba(255,215,0,0.6)]">Online</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsChallengePopUpOpen(true);
                    setOpponant(op);
                  }}
                  disabled={sentChallengeUsername === op}
                  className={`game-button ${
                    sentChallengeUsername === op
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Challenge
                </button>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}

export default OnlineUsers;
