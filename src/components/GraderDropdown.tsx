import { Accessor, For, JSX, Setter, Show, createEffect, createMemo, createSignal, untrack } from "solid-js";
import { useChords } from "./ChordsProvider";
import GraderChord from "./GraderChord";
import { Chord, VoiceLead, VoicePart } from "../util/converters";
import { Result } from "../util/grader";

const GraderDropdown = (props: {
    voiceLead: Accessor<VoiceLead | undefined>;
    graderFunction: (userChord: VoicePart, chord: Chord, isKeyMajor: boolean) => Result;
    isKeyMajor: Accessor<boolean>;
    setTotalPoints: Setter<number>;
    children: JSX.Element;
}) => {

    const [isDrop, setIsDrop] = createSignal(true);

    const chordArr = createMemo(() => useChords()[0]);

    const [resultsList, setResultsList] = createSignal<Result[] | undefined>();

    createEffect(() => {
        const voiceLead = props.voiceLead();
        setResultsList(voiceLead?.bass.map((bassNote, index) => 
            props.graderFunction([
                bassNote,
                voiceLead.tenor[index],
                voiceLead.alto[index],
                voiceLead.soprano[index],
            ], chordArr()[index], untrack(props.isKeyMajor))));
    });

    createEffect(() => {
        props.setTotalPoints(points => 
            points + (resultsList()?.reduce<number>((points, result, index) => 
                index === 0 ? 0 :result.points + points, 0) 
            ?? 0));
    });

    return (
        <div>
            <div 
                class="bg-white px-4 py-2 cursor-pointer"
                onclick={() => setIsDrop(!isDrop())}>
                {props.children}
                <button 
                    class="font-bold float-right"
                    style={{
                        'transform': `rotate(${isDrop() ? 180 : 0}deg)`
                    }}>
                    ▲
                </button>
            </div>
            <Show when={isDrop()}>
                <For each={resultsList()}>
                    {(result, i) =>
                    <GraderChord 
                        indicies={[i()]}
                        result={result} />}
                </For>    
            </Show>
        </div>
    );
};

export default GraderDropdown;