
interface TimerOption {
  label: string;
  value: string;
}

interface TimerCategory {
  name: string;
  options: TimerOption[];
}
type Props = {
  onQuickPair: (timer: string) => void
}

function QuickGame({onQuickPair}: Props) {
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
    <div className="quick-game text-center">
      <h2 className="text-2xl font-bold text-yellow-400 mb-6">Quick Game</h2>
      <h3 className="flex text-white font-bold m-2">Bullet</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {timerCategories
          .find((category) => category.name === "Bullet")
          ?.options.map((option) => (
            <button
              key={option.value}
              className="bg-[#454545] text-yellow-500 border border-yellow-400 font-semibold rounded-lg hover:bg-yellow-400 hover:text-black px-6 py-3 transition-all ease-in-out transform hover:scale-105"
              onClick={() => onQuickPair(option.value)}
            >
              {option.label}
            </button>
          ))}
      </div>
      <h3 className="flex text-white font-bold m-2">Blitz</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {timerCategories
          .find((category) => category.name === "Blitz")
          ?.options.map((option) => (
            <button
              key={option.value}
              className="bg-[#454545] text-yellow-500 border border-yellow-400 font-semibold rounded-lg hover:bg-yellow-400 hover:text-black px-6 py-3 transition-all ease-in-out transform hover:scale-105"
              onClick={() => onQuickPair(option.value)}
            >
              {option.label}
            </button>
          ))}
      </div>
      <h3 className="flex text-white font-bold m-2">Rapid</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {timerCategories
          .find((category) => category.name === "Rapid")
          ?.options.map((option) => (
            <button
              key={option.value}
              className="bg-[#454545] text-yellow-500 border border-yellow-400 font-semibold rounded-lg hover:bg-yellow-400 hover:text-black px-6 py-3 transition-all ease-in-out transform hover:scale-105"
              onClick={() => onQuickPair(option.value)}
            >
              {option.label}
            </button>
          ))}
      </div>
    </div>
  );
}

export default QuickGame;
