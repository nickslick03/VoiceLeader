import { Accessor, For } from "solid-js";
import { Feedback } from "../util/types";

const GraderMessage = (props: {
    message: Accessor<Feedback | undefined>,
    showCitations?: Accessor<boolean>
}) => {

    const criterion = props.message()?.criterion;

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
            <div
                class={`${props?.showCitations && props.showCitations() ? '' : 'hidden'} text-gray-600 italic`}
            >
                Question 6 - {criterion?.numeral}. {criterion?.letter}. {criterion?.number?.join(', ')}.
            </div>
        </li>
    );
};

export default GraderMessage;