import React from "react";
import "@testing-library/jest-dom/extend-expect";
import Staff, { Chord, Side } from "./Staff.tsx";
import ShallowRenderer from "react-test-renderer/shallow";
import TestRenderer from "react-test-renderer";
import { BaseTone } from "./Notes";
import { _testing } from "./Staff.tsx";

const { Note, LedgerLines, cluster } = _testing;

const toneA_1 = {
  baseTone: BaseTone.A,
  octave: -1,
  midiNote: 36,
  strKey: "A-1",
  staffPosition: 13,
  hasNeighbor: false
};
const toneA0 = {
  baseTone: BaseTone.A,
  octave: 0,
  midiNote: 12,
  strKey: "A0",
  staffPosition: 6,
  hasNeighbor: false
};
const toneA1 = {
  baseTone: BaseTone.A,
  octave: 1,
  midiNote: 12,
  strKey: "A1",
  staffPosition: -2,
  hasNeighbor: false
};

describe("integration", () => {
  it("should render staff and chord", () => {
    const testRenderer = TestRenderer.create(
        <Staff
            tones={[
              { baseTone: BaseTone.A, octave: 0 },
              { baseTone: BaseTone.C, octave: 0 }
            ]}
        />
    );
    // noinspection HtmlUnknownAttribute
    expect(testRenderer.toJSON()).toMatchInlineSnapshot(`
      <div
        className="staff"
      >
        <svg
          className="staff"
          height="300"
          width={0}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            className="staff__line"
            height="4"
            width={0}
            x={0}
            y={61}
          />
          <rect
            className="staff__line"
            height="4"
            width={0}
            x={0}
            y={85}
          />
          <rect
            className="staff__line"
            height="4"
            width={0}
            x={0}
            y={109}
          />
          <rect
            className="staff__line"
            height="4"
            width={0}
            x={0}
            y={133}
          />
          <rect
            className="staff__line"
            height="4"
            width={0}
            x={0}
            y={157}
          />
        </svg>
      </div>
    `);
  });
});

describe("Chord", () => {
  const renderer = new ShallowRenderer();
  it("should render a single Note", () => {
    const toneA0 = { baseTone: BaseTone.A, octave: 0 };

    const result = renderer.render(<Chord tones={[toneA0]} x={50} />);
    const [notes] = result.props.children;
    const [note] = notes;

    expect(note.props).toMatchObject({
      toneInfo: expect.objectContaining({ ...toneA0 })
    });
  });

  it("should render two adjacent nodes as neighbors", () => {
    const toneA0 = { baseTone: BaseTone.A, octave: 0 };
    const toneD0 = { baseTone: BaseTone.D, octave: 0 };
    const toneH0 = { baseTone: BaseTone.H, octave: 0 };
    const tones = [toneA0, toneD0, toneH0];

    const result = renderer.render(<Chord tones={tones} x={50} />);

    const [notes] = result.props.children;
    const [noteD0, noteA0, noteH0 ] = notes;

    expect(noteD0.props).toMatchObject(
        expect.objectContaining({
              isTop: false,
              isBottom: true,
              toneInfo: expect.objectContaining({
                ...toneD0,
              })
            }
        )
    );

    expect(noteA0.props).toMatchObject({
      isTop: false,
      isBottom: false,
      toneInfo: expect.objectContaining({
        ...toneA0,
      })
    });
    expect(noteH0.props).toMatchObject({
      isTop: true,
      isBottom: false,
      toneInfo: expect.objectContaining({
        ...toneH0,
      })
    });
  });
});

describe("Note", () => {
  const renderer = new ShallowRenderer();

  it("should render a single note", () => {
    const result = renderer.render(<Note toneInfo={toneA0} stemSide={Side.LEFT} />);
    const children = result.props.children.filter(child => child);

    expect(children).toHaveLength(1);
    const [noteHead] = children;
    expect(noteHead.props).toMatchObject({ positionInStaff: 6 });
  });

  it("should render a note with ledger lines below", () => {
    const result = renderer.render(
        <Note toneInfo={{ ...toneA_1, isBottom: true }} stemSide={Side.LEFT} />
    );
    const children = result.props.children.filter(child => child);

    const [ledgerLines, noteHead] = children;
    expect(ledgerLines.props).toMatchObject({ maxExtent: 13 });
    expect(noteHead.props).toMatchObject({ positionInStaff: 13 });
  });

  it("should render a note with ledger lines above", () => {
    const result = renderer.render(
        <Note toneInfo={{ ...toneA1, isTop: true }} stemSide={Side.LEFT} />
    );
    const children = result.props.children.filter(child => child);

    expect(children).toHaveLength(2);
    const [ledgerLines, noteHead] = children;
    expect(ledgerLines.props).toMatchObject({ maxExtent: -2 });
    expect(noteHead.props).toMatchObject({ positionInStaff: -2 });
  });
});

describe("Ledger lines", () => {
  const renderer = new ShallowRenderer();

  it("should render ledger lines above", () => {
    const x = 50;

    const result = renderer.render(<LedgerLines x={x} maxExtent={-3} />);

    const children = result.props.children.filter(child => child);

    expect(children).toHaveLength(2);
    const [line1, line2] = children;
    expect(line1.props).toMatchObject({ position: -1 });
    expect(line2.props).toMatchObject({ position: -3 });
  });

  it("should render ledger lines below", () => {
    const x = 50;

    const result = renderer.render(<LedgerLines x={x} maxExtent={13} />);
    const children = result.props.children.filter(child => child);

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
