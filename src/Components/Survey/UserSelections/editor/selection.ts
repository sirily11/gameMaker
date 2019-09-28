import { SurveySelection, SurveyQuestion } from "../model/model";
import { Base } from "./base";

export class SelectionMaker extends Base<SurveySelection, any>{
    constructor(args: { id?: number, path?: string, object: SurveySelection, hasChildren?: boolean }) {
        super({ ...args, path: "", hasChildren: false })
    }
}