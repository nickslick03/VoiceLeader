import { JSX, createContext, useContext } from "solid-js";
import { SetStoreFunction, createStore } from "solid-js/store";
import type { Chord } from "../util/types";

const ChordContext = createContext();

export function ChordsProvider(props: {
  children: JSX.Element
}) {

  const chordStore = createStore<Chord[]>(
    Array(7).fill(0).map((_, i) => ({
        numeral: 1,
        quality: 'major',
        isSeventh: false,
        inversion: 0,
        secondary: 1,
        secondaryQuality: 'major'
    })));

  return (
    <ChordContext.Provider value={chordStore}>
        {props.children}
    </ChordContext.Provider>
  );
}

export function useChords() { return useContext(ChordContext) as [get: Chord[], set: SetStoreFunction<Chord[]>]; }