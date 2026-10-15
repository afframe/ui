import { describe, expect, test } from 'vitest';
import {
  applyMaskEdit,
  normalizeMaskValue,
  type MaskState,
} from './applyMaskEdit.js';
import { dateMaskSpec, timeMaskSpec, type MaskSpec } from './spec.js';

const dotted = dateMaskSpec({
  order: ['day', 'month', 'year'],
  separator: '.',
});
const slashed = dateMaskSpec({
  order: ['day', 'month', 'year'],
  separator: '/',
});
const iso = dateMaskSpec({ order: ['year', 'month', 'day'], separator: '-' });
const h23 = timeMaskSpec({ seconds: false, hourCycle: 'h23' });
const h12 = timeMaskSpec({ seconds: false, hourCycle: 'h12' });
const h23s = timeMaskSpec({ seconds: true, hourCycle: 'h23' });

// `|` marks the caret, `[` and `]` a selection.
function parse(marked: string): MaskState {
  const caret = marked.indexOf('|');
  if (caret !== -1) {
    return {
      value: marked.replace('|', ''),
      selectionStart: caret,
      selectionEnd: caret,
    };
  }
  const start = marked.indexOf('[');
  const end = marked.indexOf(']') - 1;
  return {
    value: marked.replace('[', '').replace(']', ''),
    selectionStart: start,
    selectionEnd: end,
  };
}

function show(state: MaskState): string {
  const { value, selectionStart: s, selectionEnd: e } = state;
  return s === e
    ? value.slice(0, s) + '|' + value.slice(s)
    : value.slice(0, s) + '[' + value.slice(s, e) + ']' + value.slice(e);
}

const type = (spec: MaskSpec, text: string, from = '|') =>
  [...text].reduce(
    (state, data) =>
      applyMaskEdit(state, { inputType: 'insertText', data }, spec) ?? state,
    parse(from)
  );

const edit = (
  spec: MaskSpec,
  from: string,
  inputType: string,
  data: string | null = null
) => {
  const next = applyMaskEdit(parse(from), { inputType, data }, spec);
  return next && show(next);
};

describe('typing digits', () => {
  test.each([
    ['01102026', '01.10.2026|'],
    ['0', '0|'],
    ['01', '01.|'],
    ['0110', '01.10.|'],
    ['4', '04.|'],
    ['31', '31.|'],
    ['32', '3|'],
    ['00', '0|'],
    ['012', '01.02.|'],
  ])('%s', (typed, expected) => {
    expect(show(type(dotted, typed))).toBe(expected);
  });

  test('pads a month above 1', () => {
    expect(show(type(dotted, '015'))).toBe('01.05.|');
  });

  test('rejects month 13 and 00', () => {
    expect(show(type(dotted, '0113'))).toBe('01.1|');
    expect(show(type(dotted, '0100'))).toBe('01.0|');
  });

  test('accepts any year digits', () => {
    expect(show(type(dotted, '01010000'))).toBe('01.01.0000|');
  });

  test('drops digits beyond capacity', () => {
    expect(show(type(dotted, '011020269'))).toBe('01.10.2026|');
  });
});

describe('typed separators', () => {
  test.each([
    ['1.', '01.|'],
    ['1.1.2026', '01.01.2026|'],
    ['9.12.2026', '09.12.2026|'],
    ['01.', '01.|'],
    ['01..', '01.|'],
    ['.', '|'],
    ['1/', '01.|'],
    ['1 ', '01.|'],
    ['1a', '01.|'],
    ['01.10.2026.', '01.10.2026|'],
    ['01.10.2.', '01.10.2|'],
  ])('%s', (typed, expected) => {
    expect(show(type(dotted, typed))).toBe(expected);
  });

  test('moves past the separator when the caret sits before it', () => {
    expect(show(type(dotted, '.', '01|.'))).toBe('01.|');
  });

  test('is ignored when the caret is not at the end', () => {
    expect(show(type(dotted, '.', '0|1.10.'))).toBe('0|1.10.');
  });

  test('an ignored separator does not stop the rest of the text', () => {
    expect(edit(dotted, '|', 'insertText', '.5')).toBe('05.|');
  });

  test('is ignored with a selection', () => {
    expect(edit(dotted, '[01].10.', 'insertText', '.')).toBe('[01].10.');
  });
});

describe('paste', () => {
  test.each([
    ['1.2.2026', '01.02.2026|'],
    ['01102026', '01.10.2026|'],
    ['2026-10-15', '15.10.2026|'],
    [' 2026-10-15 ', '15.10.2026|'],
    ['31.12.2026', '31.12.2026|'],
    ['abc', '|'],
  ])('%s', (text, expected) => {
    expect(edit(dotted, '|', 'insertFromPaste', text)).toBe(expected);
  });

  test('pads relative to the part at the caret', () => {
    expect(edit(dotted, '01.|', 'insertFromPaste', '2.2026')).toBe(
      '01.02.2026|'
    );
  });

  test('stops at the first rejected digit', () => {
    expect(edit(dotted, '|', 'insertFromPaste', '1.13.2026')).toBe('01.1|');
  });

  test('replaces a selection', () => {
    expect(edit(dotted, '[01.10.2026]', 'insertFromPaste', '2.3.2027')).toBe(
      '02.03.2027|'
    );
  });

  test('drop and replacement text behave as paste', () => {
    expect(edit(dotted, '|', 'insertFromDrop', '1.2.2026')).toBe('01.02.2026|');
    expect(edit(dotted, '|', 'insertReplacementText', '1.2.2026')).toBe(
      '01.02.2026|'
    );
  });
});

describe('deleting', () => {
  test.each([
    ['01.|', '0|'],
    ['01|.', '0|'],
    ['01.10.2026|', '01.10.202|'],
    ['01.1|0.2026', '01.|02.026'],
    ['|01.', '|01.'],
  ])('Backspace %s', (from, expected) => {
    expect(edit(dotted, from, 'deleteContentBackward')).toBe(expected);
  });

  test.each([
    ['01|.10.', '01.|0'],
    ['01.|10.', '01.|0'],
    ['|01.', '|1'],
    ['01.|', '01.|'],
  ])('Delete %s', (from, expected) => {
    expect(edit(dotted, from, 'deleteContentForward')).toBe(expected);
  });

  test('Backspace removes a selection', () => {
    expect(edit(dotted, '01.[10].2026', 'deleteContentBackward')).toBe(
      '01.|20.26'
    );
  });

  test('word and line deletes clear one side of the caret', () => {
    for (const inputType of [
      'deleteWordBackward',
      'deleteSoftLineBackward',
      'deleteHardLineBackward',
    ]) {
      expect(edit(dotted, '01.10.|2026', inputType)).toBe('|20.26.');
    }
    expect(edit(dotted, '01.10.|2026', 'deleteWordForward')).toBe('01.10.|');
  });
});

describe('selection replace', () => {
  test('types over the selected digits', () => {
    expect(edit(dotted, '01.[10].2026', 'insertText', '1')).toBe('01.1|2.026');
  });

  test('keeps the selection when the digit is rejected', () => {
    expect(edit(dotted, '[01].10.2026', 'insertText', '0')).toBe('0|1.02.026');
    expect(edit(dotted, '0[1].10.2026', 'insertText', '0')).toBe(
      '0[1].10.2026'
    );
  });
});

describe('unhandled input types', () => {
  test('return null', () => {
    expect(edit(dotted, '|', 'insertCompositionText', '1')).toBeNull();
    expect(edit(dotted, '|', 'historyUndo')).toBeNull();
  });
});

describe('other date layouts', () => {
  test('dd/mm/yyyy', () => {
    expect(show(type(slashed, '01102026'))).toBe('01/10/2026|');
    expect(show(type(slashed, '1.1.2026'))).toBe('01/01/2026|');
    expect(edit(slashed, '|', 'insertFromPaste', '2026-10-15')).toBe(
      '15/10/2026|'
    );
    expect(slashed.placeholder).toBe('dd/mm/yyyy');
    expect(slashed.pattern).toBe(String.raw`\d{2}\/\d{2}\/\d{4}`);
  });

  test('yyyy-mm-dd', () => {
    expect(show(type(iso, '20261015'))).toBe('2026-10-15|');
    expect(show(type(iso, '2026.4.9'))).toBe('2026-04-09|');
    expect(show(type(iso, '2026-1-'))).toBe('2026-01-|');
    expect(edit(iso, '|', 'insertFromPaste', '2026-10-15')).toBe('2026-10-15|');
    expect(iso.placeholder).toBe('yyyy-mm-dd');
    expect(iso.pattern).toBe(String.raw`\d{4}-\d{2}-\d{2}`);
  });

  test('dd.mm.yyyy attributes', () => {
    expect(dotted.placeholder).toBe('dd.mm.yyyy');
    expect(dotted.pattern).toBe(String.raw`\d{2}\.\d{2}\.\d{4}`);
    expect(new RegExp(`^${dotted.pattern}$`, 'v').test('01.10.2026')).toBe(
      true
    );
  });
});

describe('time', () => {
  test.each([
    ['905', '09:05|', h23],
    ['9:5', '09:5|', h23],
    ['9:', '09:|', h23],
    ['2359', '23:59|', h23],
    ['24', '2|', h23],
    ['3', '03:|', h23],
    ['0000', '00:00|', h23],
    ['12345', '12:34|', h23],
    ['1260', '12:06|', h23],
    ['1206', '12:06|', h23],
    ['12:5:', '12:5|', h23],
    ['13', '1|', h12],
    ['00', '0|', h12],
    ['2', '02:|', h12],
    ['1159', '11:59|', h12],
    ['235959', '23:59:59|', h23s],
    ['1:2:3', '01:02:3|', h23s],
    ['12:6', '12:06:|', h23s],
    ['1259', '12:59:|', h23s],
  ])('%s -> %s', (typed, expected, spec) => {
    expect(show(type(spec, typed))).toBe(expected);
  });

  test('attributes', () => {
    expect(h23.placeholder).toBe('hh:mm');
    expect(h23s.placeholder).toBe('hh:mm:ss');
    expect(h23s.pattern).toBe(String.raw`\d{2}:\d{2}:\d{2}`);
  });

  test('an ISO date pasted into a time is only tokenised', () => {
    expect(edit(h23, '|', 'insertFromPaste', '12:30')).toBe('12:30|');
  });
});

describe('normalizeMaskValue', () => {
  test.each([
    ['1.2.2026', 8, '01.02.2026', 10],
    ['01102026', 8, '01.10.2026', 10],
    ['01.10.2026', 3, '01.10.2026', 3],
    ['1.2.2026', 2, '01.02.2026', 3],
    ['01..10', 6, '01.10.', 6],
    ['', 0, '', 0],
    ['011020269', 9, '01.10.2026', 10],
  ])('%s at %i', (raw, caret, value, caretAfter) => {
    expect(normalizeMaskValue(raw, caret, dotted)).toEqual({
      value,
      caret: caretAfter,
    });
  });

  test('is idempotent', () => {
    const once = normalizeMaskValue('1.2.20', 6, dotted);
    expect(normalizeMaskValue(once.value, once.caret, dotted)).toEqual(once);
  });
});
