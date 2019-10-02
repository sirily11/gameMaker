import { Question } from './question';
import { BasePlayer } from "./base"
import { TreeData } from './UserSelections';

export class SelectionObj extends BasePlayer<Question>{
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
        super();
        const { title, sid, toQuestionID } = args
        this.title = title;
        this.sid = sid;
        this.toQuestionID = toQuestionID;
        this.isSelected = false;
    }

    public select(from_question: Question) {
        this.isSelected = true
        if (this.toQuestion) {
            this.toQuestion.parent = from_question
        }
    }

    public deselect() {
        this.isSelected = false
        if (this.toQuestion) {
            if (this.toQuestion.selected) this.toQuestion.selected.isSelected = false
            this.toQuestion.selected = undefined
            this.toQuestion.parent = undefined
            this.toQuestion.next = undefined
        }
    }

    public toTree(): TreeData {
        return {
            name: this.title,
            attributes: { "type": "selection", "id": this.sid },
            children: this.toQuestion ? [this.toQuestion && this.toQuestion.toTree()] : undefined,
            nodeSvgShape: {
                shape: 'rect',
                shapeProps: {
                    width: 20,
                    height: 20,
                    x: -10,
                    y: -10,
                    fill: 'purple',
                    stroke: "white"
                },
            },
        }
    }

}