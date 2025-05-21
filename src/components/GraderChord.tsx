import {  Accessor, For, Show, createMemo, createSignal } from "solid-js";
import { Feedback, Result } from "../util/types";
import GraderMessage from "./GraderMessage";
import ChordDisplay from "./ChordDisplay";

const GraderChord = (props: {
    result: Result;
    title: string;
    showCitations: Accessor<boolean>
}) => {

    const [isExpanded, setIsExpanded] = createSignal(false);

    const shortMessageIndex = createMemo(() => props.result.feedbacks?.findIndex(({isCorrect}) => !isCorrect));

    const getShortDisplay = createMemo(() =>
        shortMessageIndex() === -1
        ? 
        {
            message: 'Everything\'s correct!',
            pointsLost: 0,
            isCorrect: true
        }  as Feedback
        : props.result.feedbacks?.[shortMessageIndex() as number]);

    return (
        <div class={`${shortMessageIndex() === -1 ? 'bg-green-500' : 'bg-red-500'} bg-opacity-40
        border-black border-b-[1px] last:border-b-0
        py-2 px-2`}>
            <div class="flex gap-2">
                {props.title}
                <div class="inline-flex gap-1">
                    <For each={props.result.chords}>{chord =>
                        <div class="px-1 font-semibold bg-gray-500 bg-opacity-40 rounded-sm">
                            <ChordDisplay chord={chord}/>
                        </div>
                    }</For>    
                </div>                
            </div>
            <span class="font-bold float-right">
                {props.result.points >= 0 ? '+' : '-'} {Math.abs(props.result.points) ?? 0} point{props.result.points === 1 ? '' : 's'}
            </span>    
            <ul class="mt-2 flex flex-col gap-1">
                <Show when={isExpanded()} fallback={
                    <GraderMessage message={getShortDisplay}/>
                }>
                    <For each={props.result.feedbacks}>
                        {(message) =>
                        <GraderMessage message={() => message} showCitations={props.showCitations} />}
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