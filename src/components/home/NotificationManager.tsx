import { ReactElement } from "react";

type Props = {
  popups: { id: string; component: ReactElement; height: number }[];
};

const NotificationManager = ({ popups }: Props) => {
  const SPACING = 20; // Adjust spacing between popups

  return (
    <div>
      {popups.map((popup, index) => {
        const bottom = popups
          .slice(0, index) // Get all previous popups
          .reduce((acc, curr) => acc + curr.height + SPACING, SPACING); // Calculate cumulative bottom

        return (
          <div
            key={popup.id}
            className="bg-[#454545] right-5 px-6 py-2 rounded-lg shadow-lg max-w-fit w-full"
            style={{
              position: "fixed",
              right: "20px",
              bottom: `${bottom}px`, // Dynamic bottom position
              zIndex: 1000,
            }}
          >
            {popup.component}
          </div>
        );
      })}
    </div>
  );
};

export default NotificationManager;
