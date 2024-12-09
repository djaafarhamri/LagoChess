type ChallengePopupPropsType = {
    challenger: string, 
    timer: string,
    onAccept: (timer: string) => void, 
    onDecline: () => void
}

function ChallengerPopup({ challenger, timer, onAccept, onDecline }: ChallengePopupPropsType) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000]">
      <div className="bg-[#454545] p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h3 className="text-xl font-bold text-yellow-400 text-center">Chess Challenge</h3>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-300">
            {challenger} has challenged you to a {timer} game of chess!
          </p>
        </div>
        <div className="mt-6 space-y-4">
          <button
            className="w-full px-4 py-2 bg-green-500 text-gray-900 font-semibold rounded-md hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-300"
            onClick={() => onAccept(timer)}
          >
            Accept
          </button>
          <button
            className="w-full px-4 py-2 bg-red-500 text-gray-900 font-semibold rounded-md hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-300"
            onClick={onDecline}
          >
            Decline
          </button>
        </div>
      </div>
    </div>

  );
}

export default ChallengerPopup;