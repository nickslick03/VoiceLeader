import { Show } from "solid-js/web";
import { Chord } from "../util/types";
import ChordDisplay from "./ChordDisplay";
import { Accessor, For, Setter, createEffect } from "solid-js";
import { useChords } from "./ChordsProvider";
import { createStore } from "solid-js/store";

const ChordModal = (props: {
    getShowModal: Accessor<boolean>;
    setShowModal: Setter<boolean>;
    getCurrentIndex: Accessor<number>;
    setCurrentIndex: Setter<number>;
}) => {

    const [currentChord, setCurrentChord] = createStore<Chord>({
        numeral: 1,
        quality: 'major',
        isSeventh: false,
        inversion: 0,
        secondary: 1,
        secondaryQuality: 'major',
    });

    createEffect(() => {
        if (props.getCurrentIndex() > -1)
            setCurrentChord(Object.assign({}, useChords()[0][props.getCurrentIndex()]));
    });

    const changeSeventh = (isSeventh: boolean) => {
        if (!isSeventh) {
            if (currentChord.quality === 'majorMinor' 
            || currentChord.quality === 'halfDiminished') {
                setCurrentChord('quality', 'major');
            }
            if (currentChord.inversion === 3) {
                setCurrentChord('inversion', 0);
            }
        }
        setCurrentChord('isSeventh', isSeventh);
    };

    const setChords = useChords()[1];
    const saveChord = () => setChords(props.getCurrentIndex(), {...currentChord});

    const closeModal = (isSave: boolean) => {
        if (isSave) saveChord();
        props.setShowModal(false);
        props.setCurrentIndex(-1);
    }

    return (
        <div class={`fixed top-0 w-screen h-screen z-10
        bg-gray-700 bg-opacity-50 
        flex justify-center items-center`
            + (props.getShowModal() ? '' : ' hidden')}>
            <div 
                class="text-center bg-white px-8 py-4 
                shadow-md shadow-[rgba(0,0,0,.3)]">
                <h2 class="text-2xl font-bold mb-8">Change Chord No. {props.getCurrentIndex() + 1}</h2>
                <div class="flex justify-center flex-wrap mb-8">
                    <div class="text-6xl pr-8 self-center">
                        <ChordDisplay chord={currentChord} />
                    </div>
                    <div class="text-left flex flex-col gap-4">
                        <label>
                            Scale degree:
                            <select 
                                name="scale-degree" 
                                id="scale-degree" 
                                class="ml-1"
                                onchange={(e) => setCurrentChord('numeral', Number((e.target as HTMLSelectElement).value))}>
                                <For each={Array(7)}>
                                    {(_, i) =>
                                        <option
                                            value={i() + 1}
                                            selected={i() + 1 === currentChord.numeral}>
                                            {i() + 1}
                                        </option>}
                                </For>
                            </select>
                        </label>
                        <div class="flex gap-5">
                            <For each={['Triad', 'Seventh']}>
                                {(chordType) =>
                                    <label>
                                        <input
                                            type="radio"
                                            name="harmony"
                                            id={chordType}
                                            tabIndex={0}
                                            checked={(chordType === 'Seventh') === currentChord.isSeventh}
                                            onChange={() => changeSeventh(chordType === 'Seventh')} />
                                        &nbsp;{chordType}
                                    </label>}
                            </For>
                        </div>
                        <label class="block">
                            Qualtiy:&nbsp;
                            <select 
                                name="quality" 
                                id="quality"
                                onChange={(e) => setCurrentChord('quality', (e.target as HTMLSelectElement).value as 'major' | 'majorMinor' | 'minor' | 'halfDiminished' | 'diminished')}>
                                <option 
                                    value="major" 
                                    selected={currentChord.quality === 'major'}>
                                    Major
                                </option>
                                <Show when={currentChord.isSeventh}>
                                    <option 
                                        value="majorMinor" 
                                        selected={currentChord.quality === 'majorMinor'}>
                                        Major-Minor
                                    </option>
                                </Show>
                                <option 
                                    value="minor" 
                                    selected={currentChord.quality === 'minor'}>
                                    Minor
                                </option>
                                <Show when={currentChord.isSeventh}>
                                    <option 
                                        value="halfDiminished" 
                                        selected={currentChord.quality === 'halfDiminished'}>
                                        Half-Diminished
                                    </option>
                                </Show>
                                <option 
                                    value="diminished" 
                                    selected={currentChord.quality === 'diminished'}>
                                    Diminished
                                </option>
                            </select>
                        </label>
                        <label>
                            Inversion:&nbsp;
                            <select 
                                name="inversion" 
                                id="inversion"
                                onchange={(e) => setCurrentChord('inversion', Number((e.target as HTMLSelectElement).value))}>
                                <For each={['root', '1st', '2nd', '3rd']}>
                                    {(inversionStr, i) =>
                                    <Show when={i() !== 3 || currentChord.isSeventh}>
                                        <option
                                            value={i()}
                                            selected={currentChord.inversion === i()}>
                                            {inversionStr}
                                        </option>    
                                    </Show>}
                                </For>
                            </select>
                        </label>
                        <label>
                            Secondary Chord:&nbsp;
                            <select 
                                name="secondary-chord" 
                                id="secondary-chord" 
                                class="ml-1"
                                onchange={(e) => setCurrentChord('secondary', Number((e.target as HTMLSelectElement).value))}>
                                <For each={Array(7)}>
                                    {(_, i) =>
                                        <option
                                            value={i() + 1}
                                            selected={i() + 1 === currentChord.secondary}>
                                            {i() + 1}
                                        </option>}
                                </For>
                            </select>
                        </label>
                        <Show when={currentChord.secondary !== 1}>
                            <label class="block">
                                Secondary Qualtiy:&nbsp;
                                <select 
                                    name="secondary-quality" 
                                    id="secondary-quality"
                                    onChange={(e) => setCurrentChord('secondaryQuality', (e.target as HTMLSelectElement).value as 'major' | 'minor')}>
                                    <option 
                                        value="major" 
                                        selected={currentChord.quality === 'major'}>
                                        Major
                                    </option>
                                    <option 
                                        value="minor" 
                                        selected={currentChord.quality === 'minor'}>
                                        Minor
                                    </option>
                                </select>
                            </label>
                        </Show>
                    </div>
                </div>
                <div class="flex justify-center gap-4">
                    <button 
                        class="text-white px-2 py-1 bg-red-600 hover:bg-red-400"
                        onClick={() => closeModal(false)}>
                        Cancel
                    </button>
                    <button 
                        class="text-white px-2 py-1 bg-green-600 hover:bg-green-400"
                        onClick={() => closeModal(true)}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChordModal;