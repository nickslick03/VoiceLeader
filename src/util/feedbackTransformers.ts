import { Feedback, Outline } from "./types";

export const feedbackTransformers = {
    '2Darray': (outlines: Record<string, Outline<'2DArray'>>, name: string, wrongIndicies: number[][]) => {
        const outline = outlines[name];
        const isCorrect = wrongIndicies.length === 0;
        const feedback: Feedback = {
            isCorrect,
            pointsLost: isCorrect ? 0 : outline.points,
            message: outline[`${isCorrect ? 'correct' : 'error'}Message`],
            criterion: outline.criterion
        };
        if (!isCorrect) {
            feedback.list = wrongIndicies.map(([col1, col2]) => 
                `${outline.col1[col1]} ${outline.seperator} ${outline.col2[col2]}`);
        }
        return feedback;
    },
    array: (outlines: Record<string, Outline<'Array'>>, name: string, wrongIndicies: number[]) => {
        const outline = outlines[name];
        const isCorrect = wrongIndicies.length === 0;
        const feedback: Feedback = {
            isCorrect,
            pointsLost: isCorrect ? 0 : outline.points,
            message: outline[`${isCorrect ? 'correct' : 'error'}Message`],
            criterion: outline.criterion
        };
        if (!isCorrect) {
            feedback.list = wrongIndicies.map(part => outline.array[part]);
        }
        return feedback;
    },
    boolean: (outlines: Record<string, Outline>, name: string, isCorrect: boolean) => {
        const outline = outlines[name];
        const feedback: Feedback = {
            isCorrect,
            pointsLost: isCorrect ? 0 : outline.points,
            message: outline[`${isCorrect ? 'correct' : 'error'}Message`],
            criterion: outline.criterion
        };
        return feedback;
    }
};
