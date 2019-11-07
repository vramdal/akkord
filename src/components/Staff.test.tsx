import React from "react";
import "@testing-library/jest-dom/extend-expect";
import Staff from "./Staff";
// @ts-ignore
import ShallowRenderer from "react-test-renderer/shallow";
// @ts-ignore
import TestRenderer from "react-test-renderer";
import { _testing } from "./Staff";
import {BaseTone, NoteValues, Tone} from "../domain/Types";
import {Side, ToneInfo} from "./subcomponents/Types";
import {Chord} from "./Chord";

const { Note, LedgerLines, cluster } = _testing;

const toneA_1 : ToneInfo = {
  baseTone: BaseTone.A,
  octave: -1,
  midiNote: 36,
  strKey: "A-1",
  staffPosition: 13,
  accidental: null,
};
const toneA0 : ToneInfo = {
  baseTone: BaseTone.A,
  octave: 0,
  midiNote: 12,
  strKey: "A0",
  staffPosition: 6,
  accidental: null,
};
const toneA1 : ToneInfo  = {
  baseTone: BaseTone.A,
  octave: 1,
  midiNote: 12,
  strKey: "A1",
  staffPosition: -2,
  accidental: null,
};

describe('Staff', () => {
  const toneA0: Tone = { baseTone: BaseTone.A, octave: 0 };

  it("should render empty staff", () => {
    const testRenderer = TestRenderer.create(
        <Staff/>
    );
    expect(testRenderer.toJSON()).toMatchSnapshot();
  });

  it('should render a single chord', () => {
    const result = TestRenderer.create(<Staff>
      <Chord tones={[toneA0]}/>
    </Staff>);

    expect(result.toJSON()).toMatchSnapshot();
  });

  it('should render a half note', () => {
    const result = TestRenderer.create(
        <Chord tones={[toneA0]} noteValue={NoteValues.HALF}/>
    );

    expect(result.toJSON()).toMatchSnapshot();
  });

});

describe("Chord", () => {
  it("should render a single Note", () => {
    const toneA0: Tone = { baseTone: BaseTone.A, octave: 0 };

    const result = TestRenderer.create(<Chord tones={[toneA0]} />);

    expect(result.toJSON()).toMatchSnapshot();
  });

  it("should render two adjacent nodes as neighbors", () => {
    const toneA0: Tone = { baseTone: BaseTone.A, octave: 0 };
    const toneD0: Tone = { baseTone: BaseTone.D, octave: 0 };
    const toneH0: Tone = { baseTone: BaseTone.H, octave: 0 };
    const tones = [toneA0, toneD0, toneH0];

    const result = TestRenderer.create(<Chord tones={tones} />);

    expect(result.toJSON()).toMatchSnapshot();
  });

  it('should use the stem side of the top-most node for the entire chord', () => {
    const toneA1: Tone = { baseTone: BaseTone.A, octave: 1 };
    const toneD0: Tone = { baseTone: BaseTone.D, octave: 0 };

    const result = TestRenderer.create(<Chord tones={[toneA1, toneD0]}/>);

    expect(result.toJSON()).toMatchSnapshot();
  });

  it('should render a half note', () => {
    const toneA0: Tone = { baseTone: BaseTone.A, octave: 0 };
    const tones = [toneA0];

    const renderer = TestRenderer.create(<Chord tones={tones} noteValue={NoteValues.HALF}/>);
    expect(renderer.toJSON()).toMatchSnapshot()
  });
});

describe("Note", () => {
  // @ts-ignore
  const renderer = new ShallowRenderer();

  it("should render a single note", () => {
    const result = renderer.render(<Note toneInfo={toneA0} stemSide={Side.LEFT} />);
    const children = result.props.children.filter((child: unknown) => child);

    expect(children).toHaveLength(1);
    const [noteHead] = children;
    expect(noteHead.props).toMatchObject({ positionInStaff: 6 });
  });

  it("should render a note with ledger lines below", () => {
    const result = renderer.render(
        <Note toneInfo={ toneA_1 } stemSide={Side.LEFT} />
    );
    const children = result.props.children.filter((child: unknown) => child);

    const [ledgerLines, noteHead] = children;
    expect(ledgerLines.props).toMatchObject({ maxExtent: 13 });
    expect(noteHead.props).toMatchObject({ positionInStaff: 13 });
  });

  it("should render a note with ledger lines above", () => {
    const result = renderer.render(
        <Note toneInfo={{ ...toneA1}} stemSide={Side.LEFT} />
    );
    const children = result.props.children.filter((child: unknown) => child);

    expect(children).toHaveLength(2);
    const [ledgerLines, noteHead] = children;
    expect(ledgerLines.props).toMatchObject({ maxExtent: -2 });
    expect(noteHead.props).toMatchObject({ positionInStaff: -2 });
  });

});

describe("Ledger lines", () => {
  // @ts-ignore
  const renderer = new ShallowRenderer();

  it("should render ledger lines above", () => {
    const x = 50;

    const result = renderer.render(<LedgerLines x={x} maxExtent={-3} />);

    const children = result.props.children.filter((child: unknown) => child);

    expect(children).toHaveLength(2);
    const [line1, line2] = children;
    expect(line1.props).toMatchObject({ position: -1 });
    expect(line2.props).toMatchObject({ position: -3 });
  });

  it("should render ledger lines below", () => {
    const x = 50;

    const result = renderer.render(<LedgerLines x={x} maxExtent={13} />);
    const children = result.props.children.filter((child: unknown) => child);

    expect(children).toHaveLength(2);
    const [line1, line2] = children;
    expect(line1.props).toMatchObject({ position: 11 });
    expect(line2.props).toMatchObject({ position: 13 });
  });
});

describe('cluster', function () {
  const E1 = {
    staffPosition: 1,
    baseTone: BaseTone.E,
    octave: 0,
    midiNote: 12,
    strKey: "E1"
  };
  const D1 = {
    staffPosition: 2,
    baseTone: BaseTone.D,
    octave: 1,
    midiNote: 14,
    strKey: "D1"
  };
  const C0 = {
    staffPosition: 3,
    baseTone: BaseTone.E,
    octave: 1,
    midiNote: 16,
    strKey: "C1"
  };
  const Am1 = {
    staffPosition: 12,
    baseTone: BaseTone.A,
    octave: -1,
    midiNote: 2,
    strKey: "A-1"
  };


  it('should create a single-note cluster', function () {
    const clusters = cluster([{
      staffPosition: 1,
      baseTone: BaseTone.E,
      octave: 0,
      midiNote: 12,
      strKey: "A0"
    }
    ]);

    expect(clusters).toHaveLength(1);
  });

  it('should create two separate clusters for two disjointed tones', function () {
    const clusters = cluster([C0, E1]);

    expect(clusters).toHaveLength(2);
  });

  it('should group two adjacent notes in a cluster', function () {
    const clusters = cluster([C0, D1]);

    expect(clusters).toHaveLength(1);
    const [cluster1] = clusters;
    expect(cluster1).toHaveLength(2);
  });

  it('should create two clusters from two groups of adjacent notes', function () {
    const clusters = cluster([Am1, C0, D1]);

    expect(clusters).toHaveLength(2);
    const [cluster1, cluster2] = clusters;
    expect(cluster2).toHaveLength(2);
    expect(cluster1).toHaveLength(1);

  });

});
