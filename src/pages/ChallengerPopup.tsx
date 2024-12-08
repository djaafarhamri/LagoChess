type ChallengePopupPropsType = {
    challenger: string, 
    timer: string,
    onAccept: (timer: string) => void, 
    onDecline: () => void
}

function ChallengerPopup({ challenger, timer, onAccept, onDecline }: ChallengePopupPropsType) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Chess Challenge</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              {challenger} has challenged you to a {timer} game of chess!
            </p>
          </div>
          <div className="items-center px-4 py-3">
            <button
              id="ok-btn"
              className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
              onClick={() => onAccept(timer)}
            >
              Accept
            </button>
            <button
              id="cancel-btn"
              className="mt-3 px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
              onClick={onDecline}
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChallengerPopup;