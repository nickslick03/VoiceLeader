import { createSignal, For } from "solid-js";
import { PRESET_CHORDS } from "../static/PresetChords";
import ChordDisplay from "./ChordDisplay";
import { useChords } from "./ChordsProvider";

const PresetChords = () => {
    const [showModal, setShowModal] = createSignal(false);

    const [selectedIndex, setSelectedIndex] = createSignal<number>(-1);

    const chordHook = useChords();

    const setPresetChordProgression = (index: number) => {
        for (let i = 0; i < PRESET_CHORDS[index].length; i ++) {
            chordHook![1](i, PRESET_CHORDS[index][i]);
        }
    }

    return (
        <>
            <div class="flex justify-center">
                <button
                    class="px-4 py-2 bg-gray-300 shadow-md shadow-[rgba(0,0,0,.3)] hover:bg-gray-200"
                    onClick={() => setShowModal(true)}>
                    Preset Chord Progressions
                </button>    
            </div>
            <div class={`fixed top-0 w-screen h-screen z-10
            bg-gray-700 bg-opacity-50 
            flex justify-center items-center`
                + (showModal() ? '' : ' hidden')}>
                <div 
                    class="text-center bg-white px-8 py-4 
                    shadow-md shadow-[rgba(0,0,0,.3)]">
                    <h2 class="font-bold text-2xl mb-4">
                        Load Preset Chord Progressions
                    </h2>
                    <div class="flex flex-col gap-4 mb-4">
                        <For each={PRESET_CHORDS}>{(progression, i) =>
                            <div
                                class={`bg-gray-200 rounded flex gap-4 px-4 py-1 hover:bg-gray-300 select-none cursor-pointer
                                ${selectedIndex() == i() ? ' bg-blue-200 hover:bg-blue-300' : ''}`}
                                onclick={() => setSelectedIndex(i())}>
                                <For each={progression}>{(chord, i) =>
                                    <>
                                        <div class="font-semibold text-xl">
                                            <ChordDisplay chord={chord}/> 
                                        </div>
                                        <div class={`${progression.length - 1 == i() ? 'hidden' : ''}`}>→</div>
                                    </>
                                }</For>
                            </div>                 
                        }</For>
                    </div>
                    <div class="mb-4">
                        Note: This will override your current chord progression!
                    </div>
                    <div class="sticky bottom-0 flex justify-center gap-4 items-end">
                        <button
                            class="text-white px-4 py-2 bg-red-600 shadow-md hover:bg-red-400"
                            onClick={() => {setShowModal(false); setSelectedIndex(-1);}}>
                            Close
                        </button>
                        <button
                            class="text-white px-4 py-2 bg-green-600 shadow-md hover:bg-green-400 disabled:bg-green-600 disabled:bg-opacity-40"
                            disabled={selectedIndex() === -1 ? true : undefined}
                            onClick={() =>{ setPresetChordProgression(selectedIndex()); setShowModal(false); }}>
                            Load
                        </button>
                    </div>
                </div>
            </div>
        </>
        
    )
}

export default PresetChords;