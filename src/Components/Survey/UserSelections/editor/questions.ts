import { Base } from "./base";
import { GameQuestion } from "../model/model";
import { SelectionMaker } from "./selection";

export class QuestionMaker extends Base<GameQuestion, SelectionMaker>{


    constructor(args: { id?: number, path?: string, object?: GameQuestion, hasChildren?: boolean }) {
        super({ ...args, path: "" })
    }

    public async build(data: GameQuestion): Promise<Base<GameQuestion, SelectionMaker>> {
        data.selections && data.selections.forEach((selection) => {
            let s = new SelectionMaker({});
            s.build(selection)
            this.addChild(s)
        })

        this.object = { ...data, selections: undefined };
        return this
    }

    public toJSON(): GameQuestion | undefined {
        return { ...this.object, selections: this.children.map((s) => s.toJSON()) } as GameQuestion
    }

}