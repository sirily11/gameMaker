import { UserSelections } from '../UserSelections';
import { Question } from '../question';

describe("Test user selection", () => {
    let userSelections: UserSelections
    beforeEach(async () => {
        userSelections = new UserSelections()
        await userSelections.build({
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
        })
    })



    it("Test building the questions tree is Correct", async () => {
        expect(await userSelections.getMaxDepthOfTree()).toBe(3)
        expect(userSelections.currentQuestion).toBeDefined()
        if (userSelections.currentQuestion) {
            expect(userSelections.currentQuestion.title).toBe("Test Question 1")
            expect(userSelections.currentQuestion.next).toBeUndefined()
            expect(userSelections.currentQuestion.parent).toBeUndefined()
            expect(userSelections.hasNext()).toBeFalsy()
            expect(userSelections.hasPrev()).toBeFalsy()
            expect(userSelections.isFinished()).toBeFalsy()
        }

    })

    it("Test select selection", async () => {
        userSelections.select(1)
        expect(userSelections.hasNext()).toBeTruthy()
        expect(userSelections.hasPrev()).toBeFalsy()
        expect(userSelections.isFinished()).toBeFalsy()
        /// move to next question
        userSelections.next()
        expect(userSelections.currentQuestion).toBeDefined()
        if (userSelections.currentQuestion) {
            expect(userSelections.currentQuestion.title).toBe("Test Question 2")
            expect(userSelections.isFinished()).toBeFalsy()
            expect(userSelections.hasNext()).toBeFalsy()
            expect(userSelections.hasPrev()).toBeTruthy()
            expect(await userSelections.getMaxDepthOfTree()).toBe(2)
        }
    })



    it("Test select selection doesn't exist", async () => {
        expect(() => { userSelections.select(100) }).toThrowError()
    })

    it("Test select something leads to end", () => {
        userSelections.select(1);
        userSelections.next()
        userSelections.select(4)
        expect(userSelections.hasNext()).toBeFalsy()
        expect(userSelections.isFinished()).toBeFalsy()
        if (userSelections.currentQuestion) {
            expect(userSelections.currentQuestion.selected).toBeDefined()
            if (userSelections.currentQuestion.selected) {
                expect(userSelections.currentQuestion.selected.sid).toBe(4)
            }
        }
    })

    it("Test set user id", () => {
        userSelections.setUserID(2)
        expect(userSelections.user_id).toBe(2)
    })

    it("Test is finished when the last question has been showed", async () => {
        userSelections.select(2)
        userSelections.next()
        expect(await userSelections.getMaxDepthOfTree()).toBe(1)
        expect(userSelections.isFinished()).toBeTruthy()

    })

    it("Test go to prev", async () => {
        userSelections.select(1)
        userSelections.next()
        expect(userSelections.currentQuestion).toBeDefined()
        if (userSelections.currentQuestion) {
            expect(userSelections.currentQuestion.qid).toBe(2)
        }
        userSelections.prev()
        expect(userSelections.currentQuestion).toBeDefined()
        if (userSelections.currentQuestion) {
            expect(userSelections.hasNext()).toBeTruthy()
            expect(userSelections.hasPrev()).toBeFalsy()
            expect(userSelections.currentQuestion.qid).toBe(1)
            expect(userSelections.isFinished()).toBeFalsy()
            expect(await userSelections.getMaxDepthOfTree()).toBe(3)
        }
    })

    it("Submit survey", () => {
        expect(() => { userSelections.onSubmit() }).toThrowError()
        userSelections.select(2)
        userSelections.next()
        let submitObj = userSelections.onSubmit()
        expect(submitObj.length).toBe(1)
    })

    it("Test change selection", () => {
        userSelections.select(2)
        expect(userSelections.currentQuestion).toBeDefined()
        if (userSelections.currentQuestion && userSelections.currentQuestion.next) {
            expect(userSelections.currentQuestion.next).toBeDefined()
            expect(userSelections.currentQuestion.next.qid).toBe(3)
            userSelections.select(1)
            expect(userSelections.currentQuestion.next.qid).toBe(2)
            userSelections.next()
            expect(userSelections.currentQuestion.qid).toBe(2)

        }
    })

    it("Test change selection after next and then prev", () => {
        userSelections.select(2)
        expect(userSelections.currentQuestion).toBeDefined()
        if (userSelections.currentQuestion && userSelections.currentQuestion.next) {
            userSelections.next()
            userSelections.prev()
            expect(userSelections.currentQuestion.next.selected).toBeUndefined()
            userSelections.select(1)
            userSelections.next()
            expect(userSelections.currentQuestion.qid).toBe(2)

        }
    })

})