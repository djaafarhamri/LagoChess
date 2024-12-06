import { useUser } from "../context/UserContext";

type Props = {
    users: string[],
    setOpponant: React.Dispatch<React.SetStateAction<string>>,
    setIsChallengePopUpOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function OnlineUsers({ users, setOpponant, setIsChallengePopUpOpen }: Props) {
  
  const { user } = useUser()
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {users.map((op) => { 
          if (user?.username !== op) {
            return (
              <li key={op}>
                <div className="px-4 py-4 flex items-center sm:px-6">
                  <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-indigo-600 truncate">{op}</p>
                    </div>
                  </div>
                  <div className="ml-5 flex-shrink-0">
                    <button
                      onClick={() => {
                        setIsChallengePopUpOpen(true)
                        setOpponant(op)
                      }}
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Challenge
                    </button>
                  </div>
                </div>
              </li>
            )
          }
        })}
      </ul>
    </div>
  );
}

export default OnlineUsers;