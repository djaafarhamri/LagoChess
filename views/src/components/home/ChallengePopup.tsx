interface TimerOption {
  label: string;
  value: string;
}

interface TimerCategory {
  name: string;
  options: TimerOption[];
}

const timerCategories: TimerCategory[] = [
  {
    name: "Bullet",
    options: [
      { label: "1 min", value: "1+0" },
      { label: "1 | 1", value: "1+1" },
      { label: "2 | 2", value: "2+2" },
    ],
  },
  {
    name: "Blitz",
    options: [
      { label: "3 min", value: "3+0" },
      { label: "3 | 2", value: "3+2" },
      { label: "5 min", value: "5+0" },
    ],
  },
  {
    name: "Rapid",
    options: [
      { label: "10 min", value: "10+0" },
      { label: "15 | 10", value: "15+10" },
      { label: "30 min", value: "30+0" },
    ],
  },
];

interface ChallengePopupProps {
  onChallenge: (opponant: string, timer: string) => void;
  username: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ChallengePopup({
  onChallenge,
  username,
  setIsOpen,
}: ChallengePopupProps) {
  const handleChallenge = (timer: string) => {
    onChallenge(username, timer);
    setIsOpen(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex justify-center items-center z-[1000] backdrop-blur-sm"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">Challenge {username}</h2>
          <button
            className="absolute top-4 right-4 text-[#ffd700] hover:text-[#ffed4a] transition-colors"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className="modal-content space-y-6">
          {timerCategories.map((category) => (
            <div key={category.name} className="game-card">
              <div className="game-card-header">
                <h3 className="game-card-title">{category.name}</h3>
              </div>
              <div className="grid grid-cols-3 gap-3 p-4">
                {category.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleChallenge(option.value)}
                    className="game-button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
