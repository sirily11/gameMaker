import { Base } from "./base";
import { SurveyQuestion, SurveySelection } from "../model/model";
import { SelectionMaker } from "./selection";

export class QuestionMaker extends Base<SurveyQuestion, SelectionMaker>{
    constructor(args: { id?: number, path?: string, object: SurveyQuestion, hasChildren?: boolean }) {
        super({ ...args, path: "" })
    }
}