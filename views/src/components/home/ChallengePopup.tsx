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
    ]
  },
  {
    name: "Blitz",
    options: [
      { label: "3 min", value: "3+0" },
      { label: "3 | 2", value: "3+2" },
      { label: "5 min", value: "5+0" },
    ]
  },
  {
    name: "Rapid",
    options: [
      { label: "10 min", value: "10+0" },
      { label: "15 | 10", value: "15+10" },
      { label: "30 min", value: "30+0" },
    ]
  }
];

interface ChallengePopupProps {
  onChallenge: (opponant: string, timer: string) => void;
  username: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function ChallengePopup({ onChallenge, username, setIsOpen }: ChallengePopupProps) {
  const handleChallenge = (timer: string) => {
    onChallenge(username, timer);
    setIsOpen(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000]"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-[#454545] p-6 rounded-lg max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-2xl text-gray-300 hover:text-gray-100 focus:outline-none"
          onClick={() => setIsOpen(false)}
        >
          &times;
        </button>
        {timerCategories.map((category) => (
          <div key={category.name} className="mb-6">
            <h3 className="mb-3 text-lg font-semibold text-yellow-400">{category.name}</h3>
            <div className="grid grid-cols-3 gap-3">
              {category.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleChallenge(option.value)}
                  className="p-2 bg-yellow-500 text-gray-900 font-semibold rounded-md hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

  );
}
