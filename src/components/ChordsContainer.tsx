import { For, createMemo, createSignal } from "solid-js";
import ChordDisplay from "./ChordDisplay";
import { useChords } from "./ChordsProvider";
import ChordModal from "./ChordModal";

const ChordsContainer = () => {
    
    const chordArr = createMemo(() => useChords()[0]);

    const [getShowModal, setShowModal] = createSignal(false);
    const [currChordIndex, setCurrChordIndex] = createSignal(-1);

    const showModal = (index: number) => {
        setCurrChordIndex(index);
        setShowModal(true);
    };

    return (
        <>
            <div class="flex justify-center gap-2 flex-wrap">
                <For each={Array(2)}>{(_, measureIndex) =>
                    <div class="bg-gray-400 p-2">
                        <div class="flex justify-center gap-2">
                            <For each={Array(measureIndex() === 0 ? 4 : 3)}>
                                {(i, quarterNoteIndex) =>
                                <div 
                                    class="bg-white p-2"
                                    onClick={() => showModal((measureIndex() * 4) + quarterNoteIndex())}>
                                    <ChordDisplay chord={chordArr()[(measureIndex() * 4) + quarterNoteIndex()]} />
                                </div>}
                            </For>
                        </div>
                        <div class="text-center pt-1">
                            Measure {measureIndex() + 1}
                        </div>
                    </div>}  
                </For>
            </div>
            <ChordModal 
                getShowModal={getShowModal}
                setShowModal={setShowModal}
                getCurrentIndex={currChordIndex}
                setCurrentIndex={setCurrChordIndex} />    
        </>
    );
};

export default ChordsContainer;