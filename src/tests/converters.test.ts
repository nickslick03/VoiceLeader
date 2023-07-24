import { test, expect } from "vitest";
import { getScaleDegree, scoreToVoiceLead, realizeChord, scaleDegreeToInterval } from "../util/converters";

test('transposeNoteToCMaj function', () => {
    const cMaj = [60,62,64,65,67,69,71,72];
    const dMaj = [62,64,66,67,69,71,73,74];
    const fMaj = [53,55,57,58,60,62,64,65];
    const aMin = [57,59,60,62,64,65,67,69];
    const bMin = [59,61,62,64,66,67,69,71];

    expect(getScaleDegree(
        {
            pitch: 60,
            step: 6,
            alteration: 1,
            accidental: "sharp",
            tied: false,
            noteHead: null
        },
        {
            mode: 'major',
            tonic: 'C',
            fifths: 0
        }
    )).toEqual({
        degree: 7,
        accidental: 1
    })

    cMaj.forEach((pitch, index) => {
        expect(getScaleDegree({
            pitch,
            step: index % 7,
            alteration: 0,
            accidental: null,
            tied: false,
            noteHead: null
        }, {mode: 'major', tonic: 'C', fifths: 0})).toEqual({
            degree: (index % 7) + 1,
            accidental: 0
        })
    });
  
    dMaj.forEach((pitch, index) => {
        expect(getScaleDegree({
            pitch,
            step: (1 + index) % 7,
            alteration: 0,
            accidental: null,
            tied: false,
            noteHead: null
        }, {mode: 'major', tonic: 'D', fifths: 2})).toEqual({
            degree: index % 7 + 1,
            accidental: 0
        })
    });

    fMaj.forEach((pitch, index) => {
        expect(getScaleDegree({
            pitch,
            step: (3 + index) % 7,
            alteration: 0,
            accidental: null,
            tied: false,
            noteHead: null
        }, {mode: 'major', tonic: 'F', fifths: -1})).toEqual({
            degree: index % 7 + 1,
            accidental: 0
        })
    });

    aMin.forEach((pitch, index) => {
        expect(getScaleDegree({
            pitch,
            step: (5 + index) % 7,
            alteration: 0,
            accidental: null,
            tied: false,
            noteHead: null
        }, {mode: 'minor', tonic: 'A', fifths: 0})).toEqual({
            degree: index % 7 + 1,
            accidental: 0
        })
    });

    bMin.forEach((pitch, index) => {
        expect(getScaleDegree({
            pitch,
            step: (6 + index) % 7,
            alteration: 0,
            accidental: null,
            tied: false,
            noteHead: null
        }, {mode: 'minor', tonic: 'D', fifths: 2})).toEqual({
            degree: index % 7 + 1,
            accidental: 0
        })
    });

    //G# in A Minor
    expect(getScaleDegree(
        {
            pitch: 68,
            step: 4,
            alteration: 1,
            accidental: 'sharp',
            tied: false,
            noteHead: null
        },
        {mode: 'minor', tonic: 'A', fifths: 0}
    )).toEqual({
        degree: 7,
        accidental: 1
    });

    // lowest A possible
    expect(getScaleDegree(
        {
            pitch: 21,
            step: 5,
            alteration: 0,
            accidental: 'natural',
            tied: false,
            noteHead: null
        },
        {mode: 'minor', tonic: 'A', fifths: 0}
    )).toEqual({
        degree: 1,
        accidental: 0
    });
})

test('staffToScaleDegrees function', () => {
    expect(scoreToVoiceLead({
        "staves": [
            {
                "measures": [
                    {
                        "noteSets": [
                            {
                                "position": 0,
                                "duration": 1,
                                "voice": 0,
                                "beam": false,
                                "notes": [
                                    {
                                        "pitch": 52,
                                        "step": 2,
                                        "alteration": 0,
                                        "accidental": null,
                                        "noteHead": null,
                                        "tied": false
                                    },
                                    {
                                        "pitch": 60,
                                        "step": 0,
                                        "alteration": 0,
                                        "accidental": null,
                                        "noteHead": null,
                                        "tied": false
                                    }
                                ]
                            },
                            {
                                "position": 1,
                                "duration": 1,
                                "voice": 0,
                                "beam": false,
                                "notes": [
                                    {
                                        "pitch": 53,
                                        "step": 3,
                                        "alteration": 0,
                                        "accidental": null,
                                        "noteHead": null,
                                        "tied": false
                                    },
                                    {
                                        "pitch": 60,
                                        "step": 0,
                                        "alteration": 0,
                                        "accidental": null,
                                        "noteHead": null,
                                        "tied": false
                                    }
                                ]
                            },
                            {
                                "position": 2,
                                "duration": 1,
                                "voice": 0,
                                "beam": false,
                                "notes": [
                                    {
                                        "pitch": 50,
                                        "step": 1,
                                        "alteration": 0,
                                        "accidental": null,
                                        "noteHead": null,
                                        "tied": false
                                    },
                                    {
                                        "pitch": 59,
                                        "step": 6,
                                        "alteration": 0,
                                        "accidental": null,
                                        "noteHead": null,
                                        "tied": false
                                    }
                                ]
                            },
                            {
                                "position": 3,
                                "duration": 1,
                                "voice": 0,
                                "beam": false,
                                "notes": [
                                    {
                                        "pitch": 52,
                                        "step": 2,
                                        "alteration": 0,
                                        "accidental": null,
                                        "noteHead": null,
                                        "tied": false
                                    },
                                    {
                                        "pitch": 60,
                                        "step": 0,
                                        "alteration": 0,
                                        "accidental": null,
                                        "noteHead": null,
                                        "tied": false
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "measures": [
                    {
                        "noteSets": [
                            {
                                "position": 0,
                                "duration": 1,
                                "voice": 0,
                                "beam": false,
                                "notes": [
                                    {
                                        "pitch": 36,
                                        "step": 0,
                                        "alteration": 0,
                                        "accidental": null,
                                        "noteHead": null,
                                        "tied": false
                                    },
                                    {
                                        "pitch": 43,
                                        "step": 4,
                                        "alteration": 0,
                                        "accidental": null,
                                        "noteHead": null,
                                        "tied": false
                                    }
                                ]
                            },
                            {
                                "position": 1,
                                "duration": 1,
                                "voice": 0,
                                "beam": false,
                                "notes": [
                                    {
                                        "pitch": 29,
                                        "step": 3,
                                        "alteration": 0,
                                        "accidental": null,
                                        "noteHead": null,
                                        "tied": false
                                    },
                                    {
                                        "pitch": 45,
                                        "step": 5,
                                        "alteration": 0,
                                        "accidental": null,
                                        "noteHead": null,
                                        "tied": false
                                    }
                                ]
                            },
                            {
                                "position": 2,
                                "duration": 1,
                                "voice": 0,
                                "beam": false,
                                "notes": [
                                    {
                                        "pitch": 31,
                                        "step": 4,
                                        "alteration": 0,
                                        "accidental": null,
                                        "noteHead": null,
                                        "tied": false
                                    },
                                    {
                                        "pitch": 43,
                                        "step": 4,
                                        "alteration": 0,
                                        "accidental": null,
                                        "noteHead": null,
                                        "tied": false
                                    }
                                ]
                            },
                            {
                                "position": 3,
                                "duration": 1,
                                "voice": 0,
                                "beam": false,
                                "notes": [
                                    {
                                        "pitch": 36,
                                        "step": 0,
                                        "alteration": 0,
                                        "accidental": null,
                                        "noteHead": null,
                                        "tied": false
                                    },
                                    {
                                        "pitch": 43,
                                        "step": 4,
                                        "alteration": 0,
                                        "accidental": null,
                                        "noteHead": null,
                                        "tied": false
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }, {
        "fifths": 0,
        "tonic": "C",
        "mode": "major"
    })).toBeDefined();
});

test('realizeChord function', () => {
    
    // I in major
    expect(realizeChord({
        numeral: 1,
        quality: 'major',
        isSeventh: false,
        inversion: 0
    }, true)).toEqual([0, 4, 7]);

    // i in minor
    expect(realizeChord({
        numeral: 1,
        quality: 'minor',
        isSeventh: false,
        inversion: 0
    }, false)).toEqual([0, 3, 7]);

    // ii° in minor
    expect(realizeChord({
        numeral: 2,
        quality: 'diminished',
        isSeventh: false,
        inversion: 0
    }, false)).toEqual([2, 5, 8]);

    // V7 in minor
    expect(realizeChord({
        numeral: 5,
        quality: 'majorMinor',
        isSeventh: true,
        inversion: 0
    }, false)).toEqual([7, 11, 2, 5]);

    // ii/°7 in minor
    expect(realizeChord({
        numeral: 2,
        quality: 'halfDiminished',
        isSeventh: true,
        inversion: 0
    }, false)).toEqual([2, 5, 8, 0]);

    // ii°7 in minor
    expect(realizeChord({
        numeral: 2,
        quality: 'diminished',
        isSeventh: true,
        inversion: 0
    }, false)).toEqual([2, 5, 8, 11]);

    // vi in major
    expect(realizeChord({
        numeral: 6,
        quality: 'minor',
        isSeventh: false,
        inversion: 0
    }, true)).toEqual([9, 0, 4]);

    // VI in minor
    expect(realizeChord({
        numeral: 6,
        quality: 'major',
        isSeventh: false,
        inversion: 0
    }, false)).toEqual([8, 0, 3]);
});

test('scaleDegreeToInterval', () => {

    
    expect(scaleDegreeToInterval({
        degree: 7,
        accidental: 1 
    }, false)).toBe(11);

    expect(scaleDegreeToInterval({
        degree: 7,
        accidental: 0 
    }, true)).toBe(11);
});
