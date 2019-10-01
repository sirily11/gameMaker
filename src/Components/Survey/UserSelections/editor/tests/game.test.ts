import axios from 'axios';
import { Maker } from '../maker';
import { Game, GameQuestion } from '../../model/model';
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
        if (maker.object)
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
        let data: GameQuestion = {
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
        let data: GameQuestion = {
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
        let data: GameQuestion = {
            id: 1,
            title: "New title",
            description: "Some description",
            selections: []
        };
        (axios.patch as jest.Mock).mockResolvedValue({
            data: data
        });
        await maker.update({ id: 0, title: "New title", description: "New Description" })
        if (maker.object)
            expect(maker.object.title).toBe("New title")
    })
})

describe('Test game build', () => {


    let gameMaker: Maker

    beforeEach(() => {
        gameMaker = new Maker({})
    })

    it("Test game build", async () => {
        let game: Game = {
            id: 1,
            title: "Test Survey",
            create_at: "2019",
            questions: [{
                id: 1,
                title: "Test Question 1",
                description: "test question",
                selections: [{
                    id: 1,
                    title: "To question 2",
                    to_question: 2
                }, {
                    id: 2,
                    title: "To question 3",
                    to_question: 3
                }]
            }, {
                id: 2,
                title: "Test Question 2",
                description: "test question",
                selections: [{
                    id: 3,
                    title: "To question 3",
                    to_question: 3
                }, {
                    id: 4,
                    title: "Finished",
                }]
            }, {
                id: 3,
                title: "Last question",
                description: "test question",
                selections: []
            }]
        }
        await gameMaker.build(game)
        expect(gameMaker.object && gameMaker.object.title).toBe("Test Survey")
        expect(gameMaker.children.length).toBe(3)
        gameMaker.children.forEach((c, index) => {
            expect(c.object && c.object.title).toBe(game.questions && game.questions[index].title)
            expect(c.object && c.object.description).toBe(game.questions && game.questions[index].description)
        })

    })

    it("Test question build", async () => {
        const question: GameQuestion = {
            title: "Test Question",
            description: "Test Description",
            selections: [{
                title: "Selection 1"
            }, {
                title: "Selection 2"
            }, {
                title: "Selection 1"
            }]

        }
        let questionMaker = new QuestionMaker({});
        questionMaker.build(question);
        expect(questionMaker.path).toBeDefined();
        expect(questionMaker.children.length).toBe(3);
    })



})

describe("Test to json", () => {
    let maker: Maker;
    let data: Game = {
        id: 1,
        title: "Test Survey",
        create_at: "2019",
        questions: [{
            id: 1,
            title: "Test Question 1",
            description: "test question",
            selections: [{
                id: 1,
                title: "To question 2",
                to_question: 2
            }, {
                id: 2,
                title: "To question 3",
                to_question: 3
            }]
        }, {
            id: 2,
            title: "Test Question 2",
            description: "test question",
            selections: [{
                id: 3,
                title: "To question 3",
                to_question: 3
            }, {
                id: 4,
                title: "Finished",
            }]
        }, {
            id: 3,
            title: "Last question",
            description: "test question",
            selections: []
        }]
    }

    beforeEach(async () => {
        maker = new Maker({})
        await maker.build(data)

    })

    test("Test to JSON", async () => {
        let json = maker.toJSON()
        expect(json).toBeDefined()
        expect(json).toEqual(data)
        console.log(json)
    })
})
