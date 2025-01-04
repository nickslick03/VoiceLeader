export const sharpKeys = [...'CGDAEBFC'];

export const flatKeys = [...sharpKeys].reverse();

export const C_SCALE = "CDEFGAB";

export const majorIntervals = [0, 2, 4, 5, 7, 9, 11] as const;

export const minorIntervals = [0, 2, 3, 5, 7, 8, 10] as const; 

export const accidentals = {
    flat: -1,
    sharp: 1,
    doubleFlat: -2,
    doubleSharp: 2,
    natural: 0,
} as const;

export const chordIntervals = {
    majorTriad: [0, 4, 7],
    minorTriad: [0, 3, 7],
    diminishedTriad: [0, 3, 6],
    majorSeventh: [0, 4, 7, 11],
    majorMinorSeventh: [0, 4, 7, 10],
    minorSeventh: [0, 3, 7, 10],
    halfDiminishedSeventh: [0, 3, 6, 10],
    diminishedSeventh: [0, 3, 6, 9]
} as const;