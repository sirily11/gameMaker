import axios from 'axios';
import { Maker } from '../maker';
import { Game, SurveyQuestion } from '../../model/model';
import { QuestionMaker } from '../questions';
import { SelectionMaker } from '../selection';

jest.mock('axios')

describe('Test game maker', () => {
    let maker: Maker;

    beforeEach(() => {
        maker = new Maker({ id: 1, path: "survey/", object: { id: 1, title: "My Game", create_at: "" } })
    })

    it("Test add questions", async () => {
        let data: Game = {
            id: 1,
            title: "New title",
            create_at: "2019-10-11"
        };
        (axios.post as jest.Mock).mockResolvedValue({
            data: data
        });
        let question = new QuestionMaker({ object: { title: "test", description: "test", selections: [] } })
        let questionTwo = new QuestionMaker({ object: { title: "test2", description: "test2", selections: [] } })
        let childOne = await question.create()
        let childTwo = await questionTwo.create()
        await maker.addChild(childOne)
        expect(maker.children.length).toBe(1)
        await maker.addChild(childTwo)
        expect(maker.children.length).toBe(2)
    })

    it("Test deletion", async () => {
        let data: Game = {
            id: 1,
            title: "New title",
            create_at: "2019-10-11"
        };
        (axios.delete as jest.Mock).mockResolvedValue({
            data: data
        });
        let question = new QuestionMaker({ object: { title: "test", description: "test", selections: [] } })
        let questionTwo = new QuestionMaker({ object: { title: "test2", description: "test2", selections: [] } })
        let childOne = await question.create()
        let childTwo = await questionTwo.create()
        await maker.addChild(childOne)
        await maker.addChild(childTwo)
        await maker.deleteChild(maker.children[0])
        expect(maker.children.length).toBe(1)
    })

    it("Test update", async () => {
        let data: Game = {
            id: 1,
            title: "New title",
            create_at: "2019-10-11"
        };
        (axios.patch as jest.Mock).mockResolvedValue({
            data: data
        });
        await maker.update({ id: 0, title: "New title", create_at: "1" })
        expect(maker.object.title).toBe("New title")
    })

    it("Test Deletion", async () => {
        let data: Game = {
            id: 1,
            title: "New title",
            create_at: "2019-10-11"
        };
        (axios.delete as jest.Mock).mockResolvedValue({
            data: data
        });
        expect(async () => { await maker.delete() }).not.toThrowError()
    })
})

describe('Test selection maker', () => {
    let maker: QuestionMaker;

    beforeEach(() => {
        maker = new QuestionMaker({ id: 1, path: "survey/", object: { id: 1, title: "My Question", description: "My question", selections: [] } })
    })

    it("Test add selections", async () => {
        let data: SurveyQuestion = {
            id: 1,
            title: "New title",
            description: "Some description",
            selections: []
        };
        (axios.post as jest.Mock).mockResolvedValue({
            data: data
        });
        let selection = new SelectionMaker({ object: { title: "test" } })
        let selectionTwo = new SelectionMaker({ object: { title: "test2" } })
        let childOne = await selection.create()
        let childTwo = await selectionTwo.create()
        await maker.addChild(childOne)
        expect(maker.children.length).toBe(1)
        await maker.addChild(childTwo)
        expect(maker.children.length).toBe(2)
    })

    it("Test deletion", async () => {
        let data: SurveyQuestion = {
            id: 1,
            title: "New title",
            description: "Some description",
            selections: []
        };
        (axios.delete as jest.Mock).mockResolvedValue({
            data: data
        });
        let selection = new SelectionMaker({ object: { title: "test" } })
        let selectionTwo = new SelectionMaker({ object: { title: "test2" } })
        let childOne = await selection.create()
        let childTwo = await selectionTwo.create()
        await maker.addChild(childOne)
        await maker.addChild(childTwo)
        await maker.deleteChild(maker.children[0])
        expect(maker.children.length).toBe(1)
    })

    it("Test update", async () => {
        let data: SurveyQuestion = {
            id: 1,
            title: "New title",
            description: "Some description",
            selections: []
        };
        (axios.patch as jest.Mock).mockResolvedValue({
            data: data
        });
        await maker.update({ id: 0, title: "New title", description: "New Description" })
        expect(maker.object.title).toBe("New title")
    })
})
