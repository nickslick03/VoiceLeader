import {  For, Show, createMemo, createSignal } from "solid-js";
import { Result } from "../util/chordSpellingGrader";
import GraderMessage from "./GraderMessage";

const GraderChord = (props: {
    indicies: number[];
    result: Result;
}) => {

    const [isExpanded, setIsExpanded] = createSignal(false);

    const shortMessageIndex = createMemo(() => props.result.messages?.findIndex(({isCorrect}) => !isCorrect));

    const getShortDisplay = createMemo(() =>
        shortMessageIndex() === -1
        ? 
        {
            message: 'Everything\'s correct!',
            points: 0,
            isCorrect: true
        }
        : props.result.messages?.[shortMessageIndex() as number]);

    return (
        <div class={`${shortMessageIndex() === -1 ? 'bg-green-500' : 'bg-red-500'} bg-opacity-40
        border-black border-b-[1px] last:border-b-0
        py-2 px-2`}>
                <For each={props.indicies}>
                    {(index, i) =>
                    <span>
                        chord {index + 1}{props.indicies.length - 1 === i() ? '' : ' -> '}
                    </span>}
                </For>
            <Show when={props.indicies.length !== 1 || props.indicies[0] !== 0}>
                <span class="font-bold float-right">
                    + {props.result.points ?? 0} point{props.result.points === 1 ? '' : 's'}
                </span>    
            </Show>
            <ul class="mt-1 [&>li]:ml-4 flex flex-col gap-1">
                <Show when={isExpanded()} fallback={
                    <GraderMessage message={getShortDisplay}/>
                }>
                    <For each={props.result.messages}>
                        {(message) =>
                        <GraderMessage message={() => message} />}
                    </For>    
                </Show>  
            </ul>
            <button 
                class="block underline"
                onclick={() => setIsExpanded(!isExpanded())}>
                see {isExpanded() ? 'less' : 'more...'}
            </button>
        </div>
    );
};

export default GraderChord;