import { createMemo, createSignal } from "solid-js"
import { VoiceLead, Result } from "../util/types";
import GraderDropdown from "./GraderDropdown";
import { useScoreview } from "./ScoreviewProvider";
import { scoreToVoiceLead } from "../util/converters";
import {  getChordSpellingResults } from "../util/chordSpellingGrader";
import { useChords } from "./ChordsProvider";
import { getVoiceLeadingReports } from "../util/voiceLeadingGrader";

const GraderSidebar = () => {
    
    const [isVisible, setIsVisible] = createSignal(false);

    const scoreview = useScoreview()[0];

    const [voiceLead, setVoicelead] = createSignal<VoiceLead>();

    const [showCitations, setShowCitations] = createSignal<boolean>(true);

    const resetVoicelead = () => {
        scoreview()
        ?.getScore()
        .done((score) => {
            scoreview()
            ?.getKeySignature()
            .done((keySignature) => {
                setVoicelead(scoreToVoiceLead(score, keySignature));
                resetGrading();
            });
        });
    };

    const [chordSpellingResultsList, setChordSpellingResultsList] = createSignal<Result[] | undefined>();
    const [voiceLeadingResultsList, setVoiceLeadingResultsList] = createSignal<Result[] | undefined>();

    const totalPoints = createMemo(() => {
        console.log(chordSpellingResultsList(), voiceLeadingResultsList())
        const spellingPoints = chordSpellingResultsList()?.reduce<number>((points, result, index) => 
            index === 0 
                ? 0 
                : result.points + points, 0);
        const voiceLeadingPoints = voiceLeadingResultsList()?.reduce<number>((points, result) => points + result.points, 0);
        console.log(spellingPoints, voiceLeadingPoints);
        return Math.floor((spellingPoints ?? 0) + (voiceLeadingPoints ?? 0));
    });

    const chordArr = createMemo(() => useChords()![0]);

    const resetGrading = () => {
        const vc = voiceLead();
        if (vc !== undefined) {
            const spellingResults = setChordSpellingResultsList(
                getChordSpellingResults(vc, chordArr())
            );

            setVoiceLeadingResultsList(getVoiceLeadingReports(
                vc, 
                spellingResults.map(r => r.points > 0),
                chordArr(),
            ))
        }
    };

    return (
        <>
            <button 
                class="fixed top-8 right-4 px-4 py-2 text-white
                bg-green-600 shadow-md shadow-[rgba(0,0,0,.3)] hover:bg-green-400"
                onClick={() => {
                    resetVoicelead();
                    setIsVisible(true);
                    }}>
                Open Grader
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
                <div class="flex justify-center gap-2">
                    <input 
                        type="checkbox"
                        id="showCitations"
                        checked={showCitations()} 
                        onclick={() => setShowCitations(!showCitations())} />
                    <label for="showCitations">
                        Show AP Scoring Citations
                    </label>
                </div>
                <div class="text-left flex flex-col gap-10">
                    <GraderDropdown 
                        results={chordSpellingResultsList}
                        showCitations={showCitations}>
                        Chord Spelling
                    </GraderDropdown>
                    <GraderDropdown 
                        results={voiceLeadingResultsList}
                        showCitations={showCitations}>
                        Voice Leading
                    </GraderDropdown>
                </div>
                <div class="sticky bottom-0
                    flex justify-center gap-4 items-end">
                    <button
                        class="text-white px-4 py-2 bg-red-600 shadow-md shadow-[rgba(0,0,0,.3)] hover:bg-red-400"
                        onClick={() => setIsVisible(false)}>
                        Close
                    </button>
                    <button
                        class="text-white px-4 py-2 bg-green-600 shadow-md shadow-[rgba(0,0,0,.3)] hover:bg-green-400"
                        onClick={() => resetVoicelead()}>
                        Grade
                    </button>  
                </div>
            </div>
        </>
    )
};

export default GraderSidebar;