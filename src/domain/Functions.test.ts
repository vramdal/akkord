import {PreferredAccidentalsMap} from "../components/subcomponents/Types";
import {Accidental, BaseTone} from "./Types";
import * as Functions from "./Functions";

describe('toneInfoAccidentalTranslator', () => {
    it('should replace an accidental', function () {
        const replacementMap : PreferredAccidentalsMap = {[BaseTone.ASharp]: "flat"};
        const toneInfo = {
            baseTone: BaseTone.ASharp,
            staffPosition: 6,
            accidental: 'sharp' as Accidental
        };
        const result = Functions.toneInfoAccidentalTranslator(replacementMap)(toneInfo);
        expect(result).toMatchObject({
            baseTone: BaseTone.ASharp,
            staffPosition: 5,
            accidental: "flat"
        })
    });
    it('should not replace another accidental', function () {
        const replacementMap : PreferredAccidentalsMap = {[BaseTone.DSharp]: "flat"};
        const toneInfo = {
            baseTone: BaseTone.ASharp,
            staffPosition: 6,
            accidental: 'sharp' as Accidental
        };
        const result = Functions.toneInfoAccidentalTranslator(replacementMap)(toneInfo);
        expect(result).toBe(toneInfo);
    });
});