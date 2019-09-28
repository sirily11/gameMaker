import { Base } from "./base";
import { Game, SurveyQuestion } from "../model/model";
import { QuestionMaker } from './questions';


export class Maker extends Base<Game, QuestionMaker> {
    constructor(args: { id?: number, path?: string, object: Game, hasChildren?: boolean }) {
        super({ ...args, path: "" })
    }

}