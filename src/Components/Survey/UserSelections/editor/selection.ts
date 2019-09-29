import { GameSelection, GameQuestion } from "../model/model";
import { Base } from "./base";

export class SelectionMaker extends Base<GameSelection, any>{

    constructor(args: { id?: number, path?: string, object?: GameSelection, hasChildren?: boolean }) {
        super({ ...args, path: "", hasChildren: false })
    }

    public async build(data: GameSelection): Promise<Base<GameSelection, any>> {
        this.object = data;
        return this;
    }
}