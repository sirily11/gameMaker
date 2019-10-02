import { SelectionObj } from './selection';
import { TreeData } from './UserSelections';


export class Question {
    /**
     *  Question title
     */
    title: string;
    /**
     * Question id
     */
    qid: number;
    /**
     * Question image
     */
    image?: string;
    /**
     * List of question's selections
     */
    selections: SelectionObj[];
    /**
     * Which selection has been selected
     */
    selected?: SelectionObj;
    /**
     * Previous question
     */
    parent?: Question
    /**
     * Next question
     */
    next?: Question
    /**
     * Time takes for each question
     */
    time_takes: number
    description: string
    /**
     * If the question had been visited before
     */
    _isVisited: boolean;


    constructor(args: { title: string, description: string, qid: number, image?: string, selections: SelectionObj[] }) {
        const { title, description, qid, image, selections } = args
        this.title = title
        this.description = description
        this.qid = qid
        this.image = image
        this.selections = selections
        this.selected = undefined
        this.time_takes = 0
        this._isVisited = false;
    }

    /**
     * Update the time_takes
     * @param new_time new time
     */
    public update_time(new_time: number) {
        this.time_takes = new_time
    }

    /**
     * select one of the selection
     * and then set the question.next to the selection.toQuestion
     * @param sid Selection id you want to select
     */
    public select(sid: number) {
        this.deselect();
        for (let s of this.selections) {
            if (s.sid === sid) {
                this.selected = s
                this.next = s.toQuestion
                s.select(this)
            }
        }
    }

    private deselect() {
        if (this.selected) {
            this.selected.deselect()
            this.selected = undefined;
        }
    }

    public toTree(): TreeData {
        if (!this._isVisited) {
            this._isVisited = true;
            return {
                name: this.title,
                attributes: { type: "Question", id: this.qid },
                children: this.selections.map((s) => s.toTree()),
                nodeSvgShape: {
                    shape: 'circle',
                    shapeProps: {
                        r: 10,
                        fill: '#26c6da',
                        stroke: "white"
                    },
                },
            }
        } else {
            return {
                name: this.title,
                attributes: {
                    // attributes: { type: "Question", id: this.qid },
                    "IsReplicated": "true"
                },

            }
        }

    }
}