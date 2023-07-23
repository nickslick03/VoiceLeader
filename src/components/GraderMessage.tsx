import { Accessor, For, createEffect } from "solid-js";
import { Message } from "../util/grader";

const GraderMessage = (props: {
    message: Accessor<Message | undefined>
}) => {
    
    return (
        <li class={"mb-1 " + (props.message()?.isCorrect ? "list-['✅']" : "list-['🚫']")}>
            {props.message()?.message}
            {typeof props.message()?.list === 'object'
            ? <ul>
                <For each={props.message()?.list}>
                    {(item) => 
                    <li class="list-disc ml-4">
                        {item}
                    </li>}
                </For>
            </ul>
            :''}
        </li>
    );
};

export default GraderMessage;