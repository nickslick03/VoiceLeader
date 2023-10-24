import { For, createSignal } from "solid-js"
import GraderDropdown from "./GraderDropdown";
import { useScoreview } from "./ScoreviewProvider";
import { scoreToVoiceLead, VoiceLead } from "../util/converters";
import { getChordSpellingReport } from "../util/chordSpellingGrader";

const GraderSidebar = () => {
    
    const [isVisible, setIsVisible] = createSignal(false);

    const scoreview = useScoreview()[0];

    const [voiceLead, setVoicelead] = createSignal<VoiceLead>();

    const [isKeyMajor, setIsKeyMajor] = createSignal<boolean>();

    const [totalPoints, setTotalPoints] = createSignal(0);

    const resetGrading = () => {
        setTotalPoints(0);
        scoreview()
        ?.getScore()
        .done((score) => {
            scoreview()
            ?.getKeySignature()
            .done((keySignature) => {
                setVoicelead(scoreToVoiceLead(score, keySignature));
                setIsKeyMajor(keySignature.mode === 'major');
            });
        });
    };

    return (
        <>
            <button 
                class="fixed top-8 right-4 px-4 py-2 text-white
                bg-green-600 shadow-md shadow-[rgba(0,0,0,.3)] hover:bg-green-400"
                onClick={() => {
                    resetGrading();
                    setIsVisible(true);
                    }}>
                Grade
            </button>
            <div 
                class="fixed top-0 left-full w-96 text-center
                h-screen bg-gray-200 px-4 py-6 shadow-lg shadow-gray-400
                transition-transform duration-500
                [&>*]:mt-6
                overflow-y-scroll"
                style={{
                    transform: `translateX(-${isVisible() ? '100' : '0'}%)`
                }}>
                <h2 class="text-2xl font-bold">
                    Points: {totalPoints()} / 18
                </h2>
                <For each={['Chord Spelling']}>
                    {(title) =>
                    <div class="text-left">
                        <GraderDropdown 
                            voiceLead={voiceLead}
                            graderFunction={getChordSpellingReport}
                            isKeyMajor={isKeyMajor}
                            setTotalPoints={setTotalPoints}>
                            {title}
                        </GraderDropdown>
                    </div>}
                </For>
                <div></div>
                <div class="sticky bottom-0
                    flex justify-center gap-4 items-end">
                    <button
                        class="text-white px-4 py-2 bg-red-600 shadow-md shadow-[rgba(0,0,0,.3)] hover:bg-red-400"
                        onClick={() => setIsVisible(false)}>
                        Close
                    </button>
                    <button
                        class="text-white px-4 py-2 bg-green-600 shadow-md shadow-[rgba(0,0,0,.3)] hover:bg-green-400"
                        onClick={() => resetGrading()}>
                        Grade Again
                    </button>  
                </div>
            </div>
        </>
    )
};

export default GraderSidebar;