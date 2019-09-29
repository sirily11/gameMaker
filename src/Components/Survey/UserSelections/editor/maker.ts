import { Base } from "./base";
import { Game, GameQuestion } from "../model/model";
import { QuestionMaker } from './questions';


export class Maker extends Base<Game, QuestionMaker> {

    constructor(args: { id?: number, path?: string, object?: Game, hasChildren?: boolean }) {
        super({ ...args, path: "" })
    }

    public async build(data: Game): Promise<Base<Game, QuestionMaker>> {

        data.questions && data.questions.forEach(async (question) => {
            let q = new QuestionMaker({})
            q.build(question)
            await this.addChild(q)
        })

        this.object = { ...data, questions: undefined }
        return this;
    }

}