export interface SubmitObject {
    time_takes: number
    sid: number
}

export interface Game {
    id: number
    title: string
    create_at: string
    questions?: SurveyQuestion[]
}

export interface SurveyQuestion {
    id?: number
    description: string
    title: string
    image?: string
    selections?: SurveySelection[]
}

export interface SurveySelection {
    id?: number
    title: string
    to_question?: number
}
