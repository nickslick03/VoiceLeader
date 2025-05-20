import { JSX, createContext, useContext } from "solid-js";
import { SetStoreFunction, createStore } from "solid-js/store";
import type { Chord } from "../util/types";
import { localStorageGet, localStorageSet } from "../util/localStorage";
import { CHORD_QUALITIES, LOCAL_STORAGE_KEYS } from "../util/consts";

const ChordContext = createContext<[get: Chord[], set: SetStoreFunction<Chord[]>]>();

const chordTypeChecker = {
  numeral: ({numeral}: Chord) => typeof numeral === 'number' && !isNaN(numeral) && numeral >= 1 && numeral <= 7,
  quality: ({quality}: Chord) => typeof quality === 'string' && CHORD_QUALITIES.includes(quality),
  isSeventh: ({isSeventh}: Chord) => typeof isSeventh === 'boolean',
  inversion: ({inversion, isSeventh}: Chord) => typeof inversion === 'number' && inversion >= 0 && (inversion <= 2 || (isSeventh && inversion <= 3)),
  secondary: function ({secondary}: Chord) { return this.numeral({numeral: secondary} as Chord) },
  secondaryQuality: function ({secondaryQuality}: Chord) { return this.quality({quality: secondaryQuality} as Chord) }
};

export function ChordsProvider(props: {
  children: JSX.Element
}) {

  const defaultChords = Array(7).fill(0).map<Chord>(() => ({
      numeral: 1,
      quality: 'major',
      isSeventh: false,
      inversion: 0,
      secondary: 1,
      secondaryQuality: 'major'
  }));

  const chordStorage = localStorageGet<Chord[]>(LOCAL_STORAGE_KEYS.CHORDS);

  let chords: Chord[];

  if (chordStorage === null) {
    chords = defaultChords;
    localStorageSet(LOCAL_STORAGE_KEYS.CHORDS, chords);
  } else {
    let isChordStorageValid = true;
    for (let i = 0; i < chordStorage.length; i++) {
      for (let [k, v] of Object.entries(chordStorage[i])) {
        if (!chordTypeChecker[k as keyof Chord](chordStorage[i])) {
          console.error(chordStorage, `'${k}: ${v}' is not a valid chord property in chord ${i + 1} in the chords array in local storage. Reverting to default chords.`);
          isChordStorageValid = false;
        }
      }
    }
    if (chordStorage.length !== 7) {
      console.error(chordStorage, `The length of the chords array in local storage is ${chordStorage.length} but should be 7. Reverting to default chords.`);
      isChordStorageValid = false;
    }
    if (isChordStorageValid) {
      chords = chordStorage;
    } else {
      chords = defaultChords;
      localStorageSet(LOCAL_STORAGE_KEYS.CHORDS, chords);
    } 
  }

  const chordStore = createStore<Chord[]>(chords);

  return (
    <ChordContext.Provider value={chordStore}>
        {props.children}
    </ChordContext.Provider>
  );
}

export function useChords() { 
  const context = useContext(ChordContext);
  if (context === undefined) return undefined;
  const [getChords, setChords] = context;
  return [
    getChords,
    (index: number, chord: Chord) => {
      setChords(index, chord);
      localStorageSet(LOCAL_STORAGE_KEYS.CHORDS, getChords);
    }
  ] as const;
}