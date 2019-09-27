import { Question } from './question';
import { SelectionObj } from './selection';

export interface SubmitObject {
    time_takes: number
    sid: number
}

export interface Survey {
    id: number
    title: string
    create_at: string
    questions: SurveyQuestion[]
}

export interface SurveyQuestion {
    id: number
    description: string
    title: string
    image: string
    selections: SurveySelection[]
}

export interface SurveySelection {
    id: number
    title: string
    to_question: number
}

export class UserSelections {
    /**
     * The current question
     */
    currentQuestion?: Question
    /**
     * Root of the tree
     */
    root: Question
    /**
     * Survey's title
     */
    title?: string
    /**
     * Survey's sid
     */
    survey_id?: number
    /**
     * Survey's user id
     */
    user_id?: number


    constructor() {
        this.currentQuestion = null
        this.title = null
        this.survey_id = null
        this.user_id = null
    }

    /**
     *  Set the data and build the tree.
     * This will be called when survey data is received
     * @param data Survey data
     */
    setQuestionData(data: Survey): UserSelections {
        this.title = data.title
        // Question list
        let questions: Question[] = []
        this.createQuestions(data, questions);
        this.configQuestions(questions)
        this.currentQuestion = questions[0]
        this.root = questions[0]
        return this
    }

    /**
     * 
     * @param uid user ID
     */
    setUserID(uid: number): UserSelections {
        this.user_id = uid
        return this
    }

    /**
     * To the next page
     */
    next(time_takes: number = 0) {
        let prev_time = this.currentQuestion.time_takes
        this.currentQuestion.update_time(prev_time + time_takes)
        this.currentQuestion = this.currentQuestion.next
    }

    /**
     * Go to prev page
     */
    prev() {
        this.currentQuestion = this.currentQuestion.parent
    }

    /**
     * This method will return true if only if
     * - all of the selections don't have next question
     */
    isFinished(): boolean {
        for (let s of this.currentQuestion.selections) {
            if (s.toQuestion !== undefined) return false
        }
        return true
    }

    /**
     * Has next page
     * @returns true if next question exist
     */
    hasNext(): boolean {
        return this.currentQuestion.next !== undefined

    }

    /**
     * Has prev page
     */
    hasPrev(): boolean {
        return this.currentQuestion.parent !== undefined
    }

    /**
     * Select selection.
     * When user select any selection, this function will be called
     * @param sid the selection you want to select
     */
    select(sid: number) {
        if (this.currentQuestion) {
            this.currentQuestion.select(sid)
        }
        else {
            console.log(this.currentQuestion)
        }
    }

    /**
     * Get the height of the tree (max).
     * You should call this method to get tree height, 
     * if you want to get the number of remaining questions,
     * call getMaxDepthTree().
     */
    getTreeHeight(): number {
        let curNode = this.root
        let height = 0
        while (curNode !== undefined) {
            height += 1
            curNode = curNode.next
            if (height > 10000) {
                break
            }
        }
        return height
    }

    /**
     * Get the max depth of the tree based on the current question
     */
    getMaxDepthOfTree(): number {
        return this.findMax(this.currentQuestion)
    }

    /**
     * Get list of questions and its selection
     * for each question which user selected.
     * This will be called when the survey is finished
     */
    submit(time_takes: number): SubmitObject[] {
        this.currentQuestion.update_time(time_takes)
        let node = this.root
        let questionList: SubmitObject[] = []
        while (node !== undefined) {
            questionList.push({
                time_takes: node.time_takes,
                sid: node.selected.sid
            })
            node = node.next
        }
        return questionList
    }

    /**
     * Find possible max paths
     * @param node Current questions
     * @param prevParent Visited pararents
     */
    private findMax(node: Question, prevParent: Question[] = []): number {
        if (node === undefined) {
            return 0
        } else {
            let m = 0
            for (let s of node.selections) {
                if (prevParent.includes(s.toQuestion)) {
                    return m + 1
                }
                prevParent.push(s.toQuestion)
                let m_1 = this.findMax(s.toQuestion, prevParent)
                if (m_1 > m) {
                    m = m_1
                }
            }
            return m + 1
        }

    }

    private findQuestionByID(qid: number, questions: Question[]): Question | undefined {
        return questions.find((q) => q.qid === qid);
    }

    /**
     * 
     * @param questions List of questions
     */
    private configQuestions(questions: Question[]) {
        for (let q of questions) {
            for (let s of q.selections) {
                let to_question = this.findQuestionByID(s.toQuestionID, questions)
                if (to_question !== undefined) {
                    s.toQuestion = to_question
                    to_question.parent = q
                }
            }
        }
    }

    /**
     * Helper function which will
     * Create Question object
     * @param data data from server
     * @param questions an empty question list
     */
    private createQuestions(data: Survey, questions: Question[]) {
        for (let q of data.questions) {
            let selections: SelectionObj[] = [];
            for (let s of q.selections) {
                let selection = new SelectionObj({ title: s.title, sid: s.id, toQuestionID: s.to_question });
                selections.push(selection);
            }
            // let question = new Question(q.title, q.description, q.id, q.image, selections);
            let question = new Question({
                title: q.title,
                description: q.description,
                qid: q.id,
                image: q.image,
                selections: selections
            })
            questions.push(question);
        }
    }


}
