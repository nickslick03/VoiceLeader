import { accidentals, chordIntervals } from "./consts";

export type ScaleDegree = {
    /**
     * The scale degree, from 1 to 7
     */
    degree: number;
    /**
     * Any accidental, 1 being a half-step up, -1 being a half-step down, and 0 being nothing.
     */
    accidental: number;
}

/** A complete voice leading. */
export type VoiceLead = {
    keySignature: KeySignature;
    soprano: VoicePart;
    alto: VoicePart;
    tenor: VoicePart;
    bass: VoicePart;
}

/** An array of notes that make up a single voice part. */
export type VoicePart = {
    note: Note;
    scaleDegree: ScaleDegree;
}[]

/** A chord object. */
export type Chord = {
    /** The roman numeral number of the chord. */
    numeral: number;
    quality: 'major' | 'majorMinor' | 'minor' | 'halfDiminished' | 'diminished';
    isSeventh: boolean;
    /** The ordinal number of the inversion. If in root position, defaults to `1`. */
    inversion: number;
    /** The secondary function chord roman numeral number. If there is no secondary, defaults to `1`. */
    secondary: number;
    /** The quality of the secondary chord. If there is no secondary, defaults to `"major"`. */
    secondaryQuality: 'major' | 'minor';
}

export type ChordNames = keyof typeof chordIntervals;
export type AccidentalNames = keyof typeof accidentals;
