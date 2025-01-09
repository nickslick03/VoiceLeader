import { For, createEffect, createMemo, createSignal, untrack } from "solid-js"
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

    const [chordSpellingResultsList, setChordSpellingResultsList] = createSignal<Result[] | undefined>();
    const [voiceLeadingResultsList, setVoiceLeadingResultsList] = createSignal<Result[] | undefined>();

    const chordArr = createMemo(() => useChords()[0]);

    createEffect(() => {
        const vc = voiceLead();
        if (vc !== undefined) {
            console.log(vc)
            const spellingResults = setChordSpellingResultsList(
                getChordSpellingResults(vc, chordArr())
            );

                setVoiceLeadingResultsList(getVoiceLeadingReports(
                [vc.bass, vc.tenor, vc.alto, vc.soprano], 
                spellingResults.map((r, i) => r.points > 0),
                chordArr(),
                untrack(isKeyMajor) ?? true    
            ))
        }
    });

    createEffect(() => {
        setTotalPoints(points => 
            points + (chordSpellingResultsList()?.reduce<number>((points, result, index) => 
                index === 0 
                    ? 0 
                    : result.points + points, 0) 
            ?? 0));
    });

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

                    <div class="text-left flex flex-col gap-10">
                        <GraderDropdown 
                            results={chordSpellingResultsList}>
                            Chord Spelling
                        </GraderDropdown>
                        <GraderDropdown 
                            results={voiceLeadingResultsList}>
                            Voice Leading
                        </GraderDropdown>
                    </div>
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