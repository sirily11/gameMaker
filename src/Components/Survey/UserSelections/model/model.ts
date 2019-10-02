export interface SubmitObject {
    time_takes: number
    sid: number
}

export interface Game {
    id: number
    title: string
    create_at: string
    questions?: GameQuestion[]
}

export interface GameQuestion {
    id?: number
    description: string
    title: string
    image?: string
    selections?: GameSelection[]
    game?: number;
}

export interface GameSelection {
    id?: number
    title: string
    to_question?: number
    for_question?: number
}
