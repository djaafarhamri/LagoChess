type PairingLoadingPopupPropsType = {
    timer: string | null,
    onCancel: () => void
}

function PairingLoadingPopup({ timer, onCancel }: PairingLoadingPopupPropsType) {
  return (
      <div className="fixed flex flex-col bg-[#454545] bottom-5 right-5 px-6 py-2 rounded-lg shadow-lg max-w-fit w-full z-[1000]">
        <div className="text-center">
          <h3 className="mt-2 text-xl text-gray-300">
            looking for a <span className="text-yellow-400">{timer}</span> game of chess...
          </h3>
        </div>
          <button
            className="p-1  mt-2 ml-auto bg-red-500 text-gray-100 font-normal rounded-md hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-300"
            onClick={onCancel}
          >
            Cancel
          </button>
      </div>

  );
}

export default PairingLoadingPopup;