import React from "react";
import "@testing-library/jest-dom/extend-expect";
import Staff, { Chord } from "./Staff.tsx";
import ShallowRenderer from "react-test-renderer/shallow";
import TestRenderer from "react-test-renderer";
import { BaseTone } from "./Notes";
import { _testing } from "./Staff.tsx";

const { Note, LedgerLines } = _testing;

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
          width="300"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            className="staff__line"
            height="4"
            width={300}
            x={0}
            y={61}
          />
          <rect
            className="staff__line"
            height="4"
            width={300}
            x={0}
            y={85}
          />
          <rect
            className="staff__line"
            height="4"
            width={300}
            x={0}
            y={109}
          />
          <rect
            className="staff__line"
            height="4"
            width={300}
            x={0}
            y={133}
          />
          <rect
            className="staff__line"
            height="4"
            width={300}
            x={0}
            y={157}
          />
          <rect
            className="staff__line"
            height="4"
            width={40}
            x={30}
            y={181}
          />
          <ellipse
            className="note__head"
            cx={50}
            cy={183}
            data-testid="x:50,pos:11"
            rx={15}
            ry={11}
          />
          <ellipse
            className="note__head"
            cx={50}
            cy={123}
            data-testid="x:50,pos:6"
            rx={15}
            ry={11}
          />
          <rect
            className="staff__line"
            height={151}
            width={4}
            x={60}
            y={29}
          />
          <rect
            className="staff__line"
            height="4"
            width={40}
            x={130}
            y={37}
          />
          <rect
            className="staff__line"
            height="4"
            width={40}
            x={130}
            y={13}
          />
          <ellipse
            className="note__head"
            cx={150}
            cy={15}
            data-testid="x:150,pos:-3"
            rx={15}
            ry={11}
          />
          <rect
            className="staff__line"
            height={91}
            width={4}
            x={135}
            y={17}
          />
          <rect
            className="staff__line"
            height="4"
            width={40}
            x={230}
            y={181}
          />
          <rect
            className="staff__line"
            height="4"
            width={40}
            x={230}
            y={205}
          />
          <ellipse
            className="note__head"
            cx={250}
            cy={207}
            data-testid="x:250,pos:13"
            rx={15}
            ry={11}
          />
          <rect
            className="staff__line"
            height={91}
            width={4}
            x={260}
            y={113}
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
      toneInfo: expect.objectContaining({ ...toneA0, hasNeighbor: false })
    });
  });

  it("should render two adjacent nodes as neighbors", () => {
    const toneA0 = { baseTone: BaseTone.A, octave: 0 };
    const toneD0 = { baseTone: BaseTone.D, octave: 0 };
    const toneH0 = { baseTone: BaseTone.H, octave: 0 };
    const tones = [toneA0, toneD0, toneH0];

    const result = renderer.render(<Chord tones={tones} x={50} />);
    const [notes] = result.props.children;
    const [noteD0, noteA0, noteH0] = notes;

    expect(noteD0.props).toMatchObject({
      toneInfo: expect.objectContaining({
        ...toneD0,
        hasNeighbor: false,
        isTop: false,
        isBottom: true
      })
    });
    expect(noteA0.props).toMatchObject({
      toneInfo: expect.objectContaining({
        ...toneA0,
        hasNeighbor: true,
        isTop: false,
        isBottom: false
      })
    });
    expect(noteH0.props).toMatchObject({
      toneInfo: expect.objectContaining({
        ...toneH0,
        hasNeighbor: true,
        isTop: true,
        isBottom: false
      })
    });
  });
});

describe("Note", () => {
  const renderer = new ShallowRenderer();
  const x = 50;

  it("should render a single note", () => {
    const result = renderer.render(<Note toneInfo={toneA0} x={x} />);
    const children = result.props.children.filter(child => child);

    expect(children).toHaveLength(1);
    const [noteHead] = children;
    expect(noteHead.props).toMatchObject({ x: x, positionInStaff: 6 });
  });

  it("should render a note with ledger lines below", () => {
    const result = renderer.render(
      <Note toneInfo={{ ...toneA_1, isBottom: true }} x={x} />
    );
    const children = result.props.children.filter(child => child);

    const [ledgerLines, noteHead] = children;
    expect(ledgerLines.props).toMatchObject({ x: x, maxExtent: 13 });
    expect(noteHead.props).toMatchObject({ x: x, positionInStaff: 13 });
  });

  it("should render a note with ledger lines above", () => {
    const result = renderer.render(
      <Note toneInfo={{ ...toneA1, isTop: true }} x={x} />
    );
    const children = result.props.children.filter(child => child);

    expect(children).toHaveLength(2);
    const [ledgerLines, noteHead] = children;
    expect(ledgerLines.props).toMatchObject({ x: x, maxExtent: -2 });
    expect(noteHead.props).toMatchObject({ x: x, positionInStaff: -2 });
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
