import { createSignal, onMount, Setter } from "solid-js";

let scoreCount = 1;

/**
 * Removes notes that are added or deleted, doesn't revert existing notes
 * @param scoreView the scoreview object
 * @param oldScoreData the previous scoreData object, before the selectionChange event
 * @param newScoreData the current scoreData object, after the selectionChange event
 */
function undoNoteChange(scoreView: ScoreView, oldScoreData: ScoreData, newScoreData: ScoreData) {

    oldScoreData.staves.forEach((staff, staffIndex) => {

        staff.measures.forEach((measure, measureIndex) => {

            const { measures: newMeasures } = newScoreData.staves[staffIndex];

            // checks if each measure contains an added or deleted note and undoes the change
            if (measure.noteSets.some((noteSet, noteSetIndex) =>
                noteSet
                    .notes
                    .length !=
                newMeasures[measureIndex]
                    .noteSets[noteSetIndex]
                    .notes.length
            )) {
                scoreView.pasteNoteSets(measure.noteSets, staffIndex, measureIndex, 0);
            }
        });
    });
}

/**
 * reverts the score back to oldScoreData
 * @param scoreView the scoreview object
 * @param oldScoreData the previous scoreData object, before the selectionChange event
 * @param newScoreData the current scoreData object, after the selectionChange event
 */
function restorePrevScore(scoreView: ScoreView, oldScoreData: ScoreData, newScoreData: ScoreData) {
    
    oldScoreData.staves.forEach((staff, staffIndex) => {

        staff.measures.forEach((measure, measureIndex) => {

            scoreView.pasteNoteSets(measure.noteSets, staffIndex, measureIndex, 0);
        });
    });

    if (newScoreData.staves[0].measures.length > 2) {
        scoreView.selectMeasures(2, -1);
        scoreView.deleteSelection();
    }
}

const Noteflight = (props: {
    setScoreView: Setter<ScoreView | undefined>,
}) => {

    const [getScoreData, setScoreData] = createSignal<ScoreData>();

    onMount(() => {

        NFClient.init();
        const scoreView = new NFClient.ScoreView('score' + scoreCount, '241f3b52f9ea0927019af4137fd88839fe056c26', {
            width: window.innerWidth,
            height: 400,
            viewParams: {
                role: "template",
            }
        });
        props.setScoreView(scoreView);
        scoreCount++;

        scoreView.addEventListener('scoreDataLoaded', () => {

            scoreView.getScore().done((scoreData) => { setScoreData(scoreData) });

            scoreView.addEventListener('selectionChange', () => { // Change made to score

                scoreView.getScore().done((newScoreData) => {

                    if (newScoreData.staves[0].measures.length != 2) { // Measure added || deleted
                        
                        restorePrevScore(scoreView, getScoreData()!, newScoreData);
                        scoreView.getScore().done(newerScoreData => { setScoreData(newerScoreData) });

                    } else if (JSON.stringify(getScoreData()) != JSON.stringify(newScoreData)) { // Note added || deleted
                        
                        undoNoteChange(scoreView, getScoreData()!, newScoreData);
                        scoreView.getScore().done(newerScoreData => { setScoreData(newerScoreData) });
                    }
                });
            });
        });
    });
    return (
        <div class="flex justify-center">
            <div id={"score" + scoreCount}></div>
        </div>
    );
};

export default Noteflight;