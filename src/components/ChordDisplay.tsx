import { Show, createMemo } from "solid-js";
import { Chord } from "../util/types";
import { Switch, Match } from "solid-js/web";

const NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'] as const;
const TRIAD_INVERSIONS = ['', '6', '64'] as const;
const SEVENTH_INVERSIONS = ['7', '65', '43', '42'] as const;

const ChordDisplay = (props: {
    chord: Chord;
}) => {

    const inversionStr = createMemo(() => props.chord.isSeventh ?
    SEVENTH_INVERSIONS[props.chord.inversion ?? 0] 
    : TRIAD_INVERSIONS[props.chord.inversion ?? 0]);

    return (
        <span class="pb-1">
            <span>
                { props.chord.quality.match('major') !== null
                ? NUMERALS[props.chord.numeral - 1]
                : NUMERALS[props.chord.numeral - 1].toLowerCase()}
            </span>
            <sup>
                <Switch>
                    <Match when={props.chord.quality === 'halfDiminished'}>
                        ø
                    </Match>
                    <Match when={props.chord.quality === 'diminished'}>
                        o
                    </Match>
                </Switch>
            </sup>
            <Switch>
                <Match when={inversionStr().length === 1}>
                    <sup>{inversionStr()}</sup>
                </Match>
                <Match when={inversionStr().length === 2}>
                    <span class="relative">
                        <sup>{inversionStr()[0]}</sup>
                        <sub class="absolute -translate-x-full bottom-1/4">{inversionStr()[1]}</sub>
                    </span>
                </Match>
            </Switch>
            <Show when={props.chord.secondary !== 1}>
                &nbsp;/ 
                <ChordDisplay 
                    chord={{
                        numeral: props.chord.secondary as number,
                        quality: props.chord.secondaryQuality,
                        isSeventh: false,
                        inversion: 0,
                        secondary: 1,
                        secondaryQuality: 'major',
                    }}/>
            </Show>
        </span>
    );
};

export default ChordDisplay;