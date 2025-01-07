import { Accessor, For } from "solid-js";
import { Feedback } from "../util/types";

const GraderMessage = (props: {
    message: Accessor<Feedback | undefined>
}) => {
    
    return (
        <li class={"mb-2 ml-5 pl-1 " + (props.message()?.isCorrect ? "list-['✅']" : "list-['🚫']")}>
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