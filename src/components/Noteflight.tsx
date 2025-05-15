import { createSignal, onMount, Setter } from "solid-js";
import { localStorageGet, localStorageSet } from "../util/localStorage";
import { LOCAL_STORAGE_KEYS } from "../util/consts";

const SCORE_ID = 'score';

function checkNumOfMeasures(scoreData: ScoreData) {
    return scoreData.staves[0].measures.length === 2;
}

function checkNumOfNotes(scoreData: ScoreData) {
    return scoreData.staves.every(staff => 
        staff.measures.every(measure => 
            measure.noteSets.every(noteSet => 
                noteSet.notes.length == 2)));
}

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

    const [getScoreData, setScoreData] = createSignal<ScoreData | null>(localStorageGet<ScoreData>(LOCAL_STORAGE_KEYS.SCORE_DATA));

    onMount(() => {

        NFClient.init();
        const scoreView = new NFClient.ScoreView(SCORE_ID, '241f3b52f9ea0927019af4137fd88839fe056c26', {
            width: window.innerWidth,
            height: 400,
            viewParams: {
                role: "template",
            }
        });
        
        props.setScoreView(scoreView);

        scoreView.addEventListener('scoreDataLoaded', async () => {

            const initalScoreData = await new Promise((res: (value: ScoreData) => void) => 
                scoreView
                    .getScore()
                    .done((scoreData) => res(scoreData)));
            
            if (getScoreData() === null) {
                setScoreData(initalScoreData);
            } else {
                restorePrevScore(scoreView, getScoreData()!, initalScoreData);
            }


            scoreView.addEventListener('selectionChange', () => { // Change made to score
                
                scoreView.getScore().done((newScoreData) => {

                    if (!checkNumOfMeasures(newScoreData)) { // Measure added || deleted     
                        restorePrevScore(scoreView, getScoreData()!, newScoreData);
                        scoreView.getScore().done(newerScoreData => { setScoreData(newerScoreData) });
                    } else if (!checkNumOfNotes(newScoreData)) { // Note added || deleted
                        undoNoteChange(scoreView, getScoreData()!, newScoreData);
                        scoreView.getScore().done(newerScoreData => { setScoreData(newerScoreData) });
                    } else {
                        setScoreData(newScoreData);
                    }
                    localStorageSet(LOCAL_STORAGE_KEYS.SCORE_DATA, getScoreData());
                });
            });
        });

        setInterval(() => scoreView.getScore().done(scoreData => { 
            if (checkNumOfMeasures(scoreData) && checkNumOfNotes(scoreData)) 
                setScoreData(scoreData);
                localStorageSet(LOCAL_STORAGE_KEYS.SCORE_DATA, scoreData);
        }), 5000);
    });
    return (
        <div class="flex justify-center" >
            <div id={SCORE_ID}></div>
        </div>
    );
};

export default Noteflight;