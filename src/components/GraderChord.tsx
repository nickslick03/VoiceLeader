import {  For, Show, createMemo, createSignal } from "solid-js";
import { Result } from "../util/types";
import GraderMessage from "./GraderMessage";

const GraderChord = (props: {
    result: Result;
    title: string;
}) => {

    const [isExpanded, setIsExpanded] = createSignal(false);

    const shortMessageIndex = createMemo(() => props.result.feedbacks?.findIndex(({isCorrect}) => !isCorrect));

    const getShortDisplay = createMemo(() =>
        shortMessageIndex() === -1
        ? 
        {
            message: 'Everything\'s correct!',
            points: 0,
            isCorrect: true
        }
        : props.result.feedbacks?.[shortMessageIndex() as number]);

    return (
        <div class={`${shortMessageIndex() === -1 ? 'bg-green-500' : 'bg-red-500'} bg-opacity-40
        border-black border-b-[1px] last:border-b-0
        py-2 px-2`}>
            <span>
                {props.title}
            </span>
            <span class="font-bold float-right">
                {props.result.points >= 0 ? '+' : '-'} {Math.abs(props.result.points) ?? 0} point{props.result.points === 1 ? '' : 's'}
            </span>    
            <ul class="mt-2 flex flex-col gap-1">
                <Show when={isExpanded()} fallback={
                    <GraderMessage message={getShortDisplay}/>
                }>
                    <For each={props.result.feedbacks}>
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