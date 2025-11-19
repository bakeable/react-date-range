import React from 'react';
import { subDays, addDays, isSameDay } from 'date-fns';
import DateRange from '../DateRange';
import renderer from 'react-test-renderer';

let testRenderer = null;
let instance = null;
const endDate = new Date();
const startDate = subDays(endDate, 7);

const commonProps = {
  ranges: [{ startDate, endDate, key: 'selection' }],
  onChange: () => {},
  moveRangeOnFirstSelection: false,
};

const compareRanges = (newRange, assertionRange) => {
  ['startDate', 'endDate'].forEach(key => {
    if (!newRange[key] || !assertionRange[key]) {
      return expect(newRange[key]).toEqual(assertionRange[key]);
    }
    return expect(isSameDay(newRange[key], assertionRange[key])).toEqual(true);
  });
};

beforeEach(() => {
  testRenderer = renderer.create(<DateRange {...commonProps} />);
  instance = testRenderer.getInstance();
});

describe('DateRange', () => {
  test('Should resolve', () => {
    expect(DateRange).toEqual(expect.anything());
  });

  test('calculate new selection by resetting end date', () => {
    const methodResult = instance.calcNewSelection(subDays(endDate, 10), true);
    compareRanges(methodResult.range, {
      startDate: subDays(endDate, 10),
      endDate: subDays(endDate, 10),
    });
  });

  test('calculate new selection by resetting end date if start date is not before', () => {
    const methodResult = instance.calcNewSelection(addDays(endDate, 2), true);
    compareRanges(methodResult.range, {
      startDate: addDays(endDate, 2),
      endDate: addDays(endDate, 2),
    });
  });

  test('calculate new selection based on moveRangeOnFirstSelection prop', () => {
    testRenderer.update(<DateRange {...commonProps} moveRangeOnFirstSelection />);
    const methodResult = instance.calcNewSelection(subDays(endDate, 10), true);
    compareRanges(methodResult.range, {
      startDate: subDays(endDate, 10),
      endDate: subDays(endDate, 3),
    });
  });

  test('calculate new selection by retaining end date, based on retainEndDateOnFirstSelection prop', () => {
    testRenderer.update(<DateRange {...commonProps} retainEndDateOnFirstSelection />);
    const methodResult = instance.calcNewSelection(subDays(endDate, 10), true);
    compareRanges(methodResult.range, {
      startDate: subDays(endDate, 10),
      endDate,
    });
  });

  test('calculate new selection by retaining the unset end date, based on retainEndDateOnFirstSelection prop', () => {
    testRenderer.update(
      <DateRange
        {...commonProps}
        ranges={[{ ...commonProps.ranges[0], endDate: null }]}
        retainEndDateOnFirstSelection
      />
    );
    const methodResult = instance.calcNewSelection(subDays(endDate, 10), true);
    compareRanges(methodResult.range, {
      startDate: subDays(endDate, 10),
      endDate: null,
    });
  });

  test('calculate new selection with equal length ranges enabled', () => {
    const firstRange = { startDate: startDate, endDate: addDays(startDate, 5), key: 'range1' };
    const secondRange = { startDate: null, endDate: null, key: 'range2' };

    testRenderer.update(
      <DateRange
        {...commonProps}
        ranges={[firstRange, secondRange]}
        equalLengthRanges={true}
        focusedRange={[1, 0]} // Focus on second range, start date selection
      />
    );

    const newStartDate = addDays(startDate, 10);
    const methodResult = instance.calcNewSelection(newStartDate, true);

    // Should set end date to maintain same duration as first range (5 days)
    compareRanges(methodResult.range, {
      startDate: newStartDate,
      endDate: addDays(newStartDate, 5),
    });

    // Should skip to next range instead of end date selection
    expect(methodResult.nextFocusRange[1]).toEqual(0);
  });
});
