interface TimerOption {
  label: string;
  value: string;
}

interface TimerCategory {
  name: string;
  options: TimerOption[];
}

type Props = {
  onQuickPair: (timer: string) => void;
};

function QuickGame({ onQuickPair }: Props) {
  const timerCategories: TimerCategory[] = [
    {
      name: "Bullet",
      options: [
        { label: "1 min", value: "1+0" },
        { label: "1 | 1", value: "1+1" },
        { label: "2 | 1", value: "2+1" },
        { label: "2 | 2", value: "2+2" },
        { label: "30 sec | 1", value: ".5+1" },
      ],
    },
    {
      name: "Blitz",
      options: [
        { label: "3 min", value: "3+0" },
        { label: "3 | 2", value: "3+2" },
        { label: "5 min", value: "5+0" },
        { label: "5 | 2", value: "5+2" },
        { label: "5 | 5", value: "5+5" },
      ],
    },
    {
      name: "Rapid",
      options: [
        { label: "10 min", value: "10+0" },
        { label: "15 | 10", value: "15+10" },
        { label: "10 | 5", value: "10+5" },
        { label: "20 min", value: "20+0" },
        { label: "60 min", value: "60+0" },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {timerCategories.map((category) => (
        <div key={category.name} className="game-card">
          <div className="game-card-header">
            <h3 className="game-card-title">{category.name}</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4">
            {category.options.map((option) => (
              <button
                key={option.value}
                className="game-button"
                onClick={() => onQuickPair(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default QuickGame;
