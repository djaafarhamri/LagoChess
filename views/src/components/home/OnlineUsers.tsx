import { useUser } from "../../context/UserContext";

type Props = {
  users: string[];
  setOpponant: React.Dispatch<React.SetStateAction<string>>;
  setIsChallengePopUpOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sentChallengeUsername: string
};

function OnlineUsers({ users, setOpponant, setIsChallengePopUpOpen, sentChallengeUsername }: Props) {
  const { user } = useUser();

  return (
    <div className="overflow-hidden sm:rounded-md">
      <h2 className="text-xl text-center font-bold text-yellow-400 p-4">
        Online Users
      </h2>
      {users.length === 0 ? (
        <p className="text-center text-gray-300 py-4">No users are online</p>
      ) : (
        <ul className="divide-y divide-gray-600">
          {users.map((op) =>
            user?.username !== op ? (
              <li key={op} className="flex items-center px-4 py-4 hover:bg-[#4E4D4D]">
                <p className="text-sm font-medium text-yellow-400 truncate flex-1">{op}</p>
                <button
                  onClick={() => {
                    setIsChallengePopUpOpen(true);
                    setOpponant(op);
                  }}
                  disabled={sentChallengeUsername === op}
                  className="ml-5 px-3 py-1 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 disabled:bg-[#454545]"
                >
                  Challenge
                </button>
              </li>
            ) : null
          )}
        </ul>
      )}
    </div>
  );
}

export default OnlineUsers;
