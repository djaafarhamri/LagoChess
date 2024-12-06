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
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000]" onClick={() => setIsOpen(false)}>
      <div className="bg-white p-5 rounded-lg max-w-sm w-full relative" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-2.5 right-2.5 text-2xl bg-none border-none cursor-pointer" onClick={() => setIsOpen(false)}>
          &times;
        </button>
        {timerCategories.map((category) => (
          <div key={category.name} className="mb-4">
            <h3 className='mb-2 font-semibold font-700'>{category.name}</h3>
            <div className="grid grid-cols-3 gap-2">
              {category.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleChallenge(option.value)}
                  className="p-2 bg-indigo-100 font-medium text-indigo-600 border border-indigo-300 rounded cursor-pointer hover:bg-indigo-200"
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
