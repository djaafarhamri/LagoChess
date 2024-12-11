export type UserType = {
    username: string,
    email: string,
    password: string,
    games: GameType[]
    _id: string,
    _v: number
}

export type GameType = {
    white: string | UserType,
    black: string | UserType,
    status: string,
    result: string | null,
    winner: string | null,
    moves: MoveType[],
    fen: string,
    timers: {white: number, black: number}
    createdAt: Date
}

export type MoveType = {
    san: string,
    fen: string,
    index: number
}