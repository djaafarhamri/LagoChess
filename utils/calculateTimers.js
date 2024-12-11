
module.exports =  calculateTimers= (game) => {
    const now = Date.now();
    const timeElapsed = Math.floor(
      (now - game.lastMoveTimestamp.getTime()) / 1000
    );
  
    const updatedTimers = {
      white:
        game.currTurn === "w"
          ? Math.max(game.timers.white - timeElapsed, 0)
          : game.timers.white,
      black:
        game.currTurn === "b"
          ? Math.max(game.timers.black - timeElapsed, 0)
          : game.timers.black,
    };
  
    return updatedTimers;
  }

  