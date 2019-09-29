import { Question } from './question';
import { SelectionObj } from './selection';
import { SubmitObject, Game } from '../model/model';


/**
 * Create selection objects from online data.
 * Allow user to make selection, go to next question,
 * and save selections
 */
export class UserSelections {
    /**
     * The current question
     */
    currentQuestion?: Question
    /**
     * Root of the tree
     */
    root?: Question
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

    /**
     * Set the data and build the tree.
     * This will be called when survey data is received.
     * Call this first
     * @param data Survey data
     */
    public async build(data: Game): Promise<UserSelections> {
        return new Promise((resolve, reject) => {
            this.title = data.title
            // Question list
            let questions: Question[] = []
            this.createQuestions(data, questions);
            this.configQuestions(questions)
            this.currentQuestion = questions[0]
            this.root = questions[0]
            resolve()
        })
    }

    /**
     * 
     * @param uid user ID
     */
    public setUserID(uid: number): UserSelections {
        this.user_id = uid
        return this
    }

    /**
     * To the next page
     */
    public next(time_takes: number = 0) {
        if (this.currentQuestion) {
            let prev_time = this.currentQuestion.time_takes
            this.currentQuestion.update_time(prev_time + time_takes)
            this.currentQuestion = this.currentQuestion.next
        }

    }

    /**
     * Go to prev page
     */
    public prev() {
        this.currentQuestion = this.currentQuestion && this.currentQuestion.parent
    }

    /**
     * This method will return true if only if
     * - all of the selections don't have next question
     */
    public isFinished(): boolean {
        if (this.currentQuestion) {
            for (let s of this.currentQuestion.selections) {
                if (s.toQuestion !== undefined) return false
            }
        }
        return true
    }

    /**
     * Has next page based on the selection.
     * If user select nothing, this will return false.
     * If the selection leads to finished, this returns false,
     * otherwise, true
     * @returns true if next question exist
     */
    public hasNext(): boolean {
        return (this.currentQuestion && this.currentQuestion.next) !== undefined
    }

    /**
     * Has prev page
     */
    public hasPrev(): boolean {
        return (this.currentQuestion && this.currentQuestion.parent) !== undefined
    }

    /**
     * Select selection.
     * When user select any selection, this function will be called
     * if user selected some option doesn't exist, throw error
     * @param sid the selection you want to select
     */
    public select(sid: number) {
        if (this.currentQuestion) {
            let found = this.currentQuestion.selections.find((s) => s.sid === sid) !== undefined
            if (!found) {
                throw new Error("Selection not found")
            }
            this.currentQuestion.select(sid)
        }
        else {
            console.log(this.currentQuestion)
        }
    }


    /**
     * Get the max depth of the tree based on the current question
     */
    public async getMaxDepthOfTree(): Promise<number> {
        return new Promise((resolve, reject) => {
            if (this.currentQuestion) {
                let depth = this.findMax(this.currentQuestion)
                resolve(depth)
            }
            resolve(0)
        })

    }

    /**
     * Get list of questions and its selection
     * for each question which user selected.
     * This will be called when the survey is finished
     * @return submitobject
     */
    public onSubmit(time_takes?: number): SubmitObject[] {
        if (!this.isFinished()) {
            throw new Error("Survey is not finished")
        }
        if (this.currentQuestion) {
            if (time_takes) {
                this.currentQuestion.update_time(time_takes)
            }

            let node = this.root
            let questionList: SubmitObject[] = []
            while (node !== undefined) {
                if (node.selected) {
                    questionList.push({
                        time_takes: node.time_takes,
                        sid: node.selected.sid
                    })
                }
                node = node.next
            }
            return questionList
        }
        return [];
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
                if (s.toQuestion) {

                    if (prevParent.includes(s.toQuestion)) {
                        return m + 1
                    }
                    prevParent.push(s.toQuestion)
                    let m_1 = this.findMax(s.toQuestion, prevParent)
                    if (m_1 > m) {
                        m = m_1
                    }
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
        questions.forEach((q) => {
            q.selections.forEach((s) => {
                if (s.toQuestionID) {
                    let to_question = this.findQuestionByID(s.toQuestionID, questions)
                    if (to_question !== undefined) {
                        s.toQuestion = to_question
                        to_question.parent = q
                    }
                }

            })
        })
    }

    /**
     * Helper function which will
     * Create Question object
     * @param data data from server
     * @param questions an empty question list
     */
    private createQuestions(data: Game, questions: Question[]) {
        data.questions && data.questions.forEach((q) => {
            let selections: SelectionObj[] = [];
            if (q.selections) {
                for (let s of q.selections) {
                    if (s.id) {
                        let selection = new SelectionObj({ title: s.title, sid: s.id, toQuestionID: s.to_question });
                        selections.push(selection);
                    }

                }
            }
            if (q.id) {
                let question = new Question({
                    title: q.title,
                    description: q.description,
                    qid: q.id,
                    image: q.image,
                    selections: selections
                })
                questions.push(question);
            }
        })
    }
}
