export type UserType = {
    username: string,
    email: string,
    password: string,
    games: GameType[]
    _id: string,
    _v: number
}

export type GameType = {
    white: string,
    black: string,
    status: string,
    result: string | null,
    winner: string | null,
    moves: MoveType[],
    timers: {white: number, black: number}
    createdAt: Date
}

export type MoveType = {
    from: string,
    to: string,
    promotion?: string
}