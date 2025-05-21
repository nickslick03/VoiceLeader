import { Accessor, For, JSX, Show, createSignal } from "solid-js";
import GraderChord from "./GraderChord";
import { Result } from "../util/types";

const GraderDropdown = (props: {
    results: Accessor<Result[] | undefined>;
    children: JSX.Element;
    showCitations: Accessor<boolean>;
}) => {

    const [isDrop, setIsDrop] = createSignal(true);

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
                <For each={props.results()}>
                    {(result, i) =>
                    <GraderChord
                        title={result.title ?? `Chord ${i() + 1}`}
                        result={result}
                        showCitations={props.showCitations}
                        />
                    }
                </For>    
            </Show>
        </div>
    );
};

export default GraderDropdown;