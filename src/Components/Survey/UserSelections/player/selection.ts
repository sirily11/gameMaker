import { Question } from './question';

export class SelectionObj {
    /**
     *  Next question's id
     */
    toQuestionID?: number;
    toQuestion?: Question;
    title: string;
    sid: number;
    /**
     * Is this selection has been selected
     */
    isSelected: boolean;

    constructor(args: { title: string, sid: number, toQuestionID?: number }) {
        const { title, sid, toQuestionID } = args
        this.title = title;
        this.sid = sid;
        this.toQuestionID = toQuestionID;
        this.isSelected = false;
    }

    select(from_question: Question) {
        this.isSelected = true
        if (this.toQuestion) {
            this.toQuestion.parent = from_question
        }
    }

    deselect() {
        this.isSelected = false
        if (this.toQuestion) {
            if (this.toQuestion.selected) this.toQuestion.selected.isSelected = false
            this.toQuestion.selected = undefined
            this.toQuestion.parent = undefined
            this.toQuestion.next = undefined
        }
    }

}