export type ScaleDegree = {
    /**
     * The scale degree, from 1 to 7
     */
    degree: number;
    /**
     * Any accidental, 1 being a sharp, -1 being a flat, 0 being a natural
     */
    accidental: number;
}

export type VoiceLead = {
    keySignature: KeySignature;
    soprano: VoicePart;
    alto: VoicePart;
    tenor: VoicePart;
    bass: VoicePart;
}

export type VoicePart = {
    note: Note;
    scaleDegree: ScaleDegree;
}[]

export type Chord = {
    numeral: number;
    quality: 'major' | 'majorMinor' | 'minor' | 'halfDiminished' | 'diminished';
    isSeventh: boolean;
    inversion: number;
    secondary?: number;
}

export const sharpKeys = [...'CGDAEBFC'];
export const flatKeys = [...sharpKeys].reverse();

const majorIntervals = [0, 2, 4, 5, 7, 9, 11];
const minorIntervals = [0, 2, 3, 5, 7, 8, 10];
const accidentals = {
    flat: -1,
    sharp: 1,
    doubleFlat: -2,
    doubleSharp: 2,
    natural: 0,
};

const chordIntervals = {
    majorTriad: [0, 4, 7],
    minorTriad: [0, 3, 7],
    diminishedTriad: [0, 3, 6],
    majorSeventh: [0, 4, 7, 11],
    majorMinorSeventh: [0, 4, 7, 10],
    minorSeventh: [0, 3, 7, 10],
    halfDiminishedSeventh: [0, 3, 6, 10],
    diminishedSeventh: [0, 3, 6, 9]
}

type ChordNames = keyof typeof chordIntervals;

/**
 * Converts a note to a ScaleDegree object
 * @param note the note object
 * @param keySignature the keySignautre object
 * @returns a scaleDegree object, consisting of a degree property from 1 to 7, 
 * and a accidental property representing any accidentals in number form.
 */
export function getScaleDegree({ accidental: accidentalStr, pitch }: Note, keySignature: KeySignature): ScaleDegree {
    const accidental = accidentals[accidentalStr ?? 'natural'];
    const interval = (pitch + (keySignature.mode == 'minor' ? 3 : 0) + keySignature.fifths * 5 - accidental) % 12;
    const degree = keySignature.mode == 'major'
        ? majorIntervals.findIndex(n => n == interval) + 1
        : minorIntervals.findIndex(n => n == interval) + 1;
    return {
        degree,
        accidental,
    };
}

/**
 * Converts a scaleDegree object to a numeric interval.
 * @param scaleDegree the scaleDegree object
 * @param isKeyMajor a boolean that indicates whether the key signature is major. If false, the key is minor.
 * @returns a number representing a note where 0 is the tonic and 11 is the Major 7th
 */
export function scaleDegreeToInterval(scaleDegree: ScaleDegree, isKeyMajor: boolean) {
    const scaleIntervals = isKeyMajor ? majorIntervals : minorIntervals;
    return (scaleIntervals[scaleDegree.degree - 1] + scaleDegree.accidental) % 12;
}

/**
 * Converts a ScoreData object to a VoiceLead object.
 * @param score the ScoreData object
 * @param keySignature the KeySignature object
 * @returns the VoiceLead object
 */
export function scoreToVoiceLead(score: ScoreData, keySignature: KeySignature): VoiceLead {
    const scaleDegreeList: VoicePart[] = [
        [],
        [],
        [],
        []
    ];
    score.staves.forEach((staff, staffIndex) => {
        staff.measures.forEach(measure => {
            measure.noteSets.forEach(noteSet => {
                const indicies = staffIndex == 0
                    ? [1, 0]
                    : [3, 2];
                indicies.forEach((voiceIndex, index) => {
                    scaleDegreeList[voiceIndex].push({
                        note: noteSet.notes[index],
                        scaleDegree: getScaleDegree(noteSet.notes[index], keySignature)
                    });
                });
            });
        });
    });

    return {
        keySignature,
        soprano: scaleDegreeList[0],
        alto: scaleDegreeList[1],
        tenor: scaleDegreeList[2],
        bass: scaleDegreeList[3]
    };
}


/**
 * Creates a chord realization in root position.
 *        !!! TODO: add secondary function capability !!!
 * @param chord Chord object which includes the chord numeral, the chord quality, whether its a seventh, and a secondary underneath it if applicable. 
 * @param isKeyMajor true if the key of the piece is major and false if it is minor
 * @returns an array of numbers, each number representing a note in the chord where 0 is the tonic and 11 is the Major 7th.
 */
export function realizeChord(chord: Chord, isKeyMajor: boolean): number[] {
    const chordIntervalList = chordIntervals[chord.quality + (chord.isSeventh ? 'Seventh' : 'Triad') as ChordNames];
    const scaleIntervals = isKeyMajor ? majorIntervals : minorIntervals;
    return chordIntervalList.map(interval => (scaleIntervals[chord.numeral - 1] + interval) % 12);
}