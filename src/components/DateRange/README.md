This component extends all the props of **[Calendar](#calendar)** component. In addition to those props, it has the following props:

| Prop Name                         | Type     | Description                                                                                                                                                                        |
| --------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **moveRangeOnFirstSelection**     | boolean  | When enabled, selecting a start date will automatically move the entire range duration to the new date                                                                             |
| **retainEndDateOnFirstSelection** | boolean  | When enabled, selecting a start date will keep the existing end date if the new start date is before it                                                                            |
| **equalLengthRanges**             | boolean  | When enabled, all ranges after the first must have the same duration as the first range. The end date for subsequent ranges is automatically calculated and cannot be manually set |
| **onRangeFocusChange**            | function | Callback fired when the focused range changes                                                                                                                                      |
| **rangeColors**                   | array    | Array of colors for the ranges                                                                                                                                                     |
| **ranges**                        | array    | Array of range objects                                                                                                                                                             |

#### Example: Editable Date Inputs

```jsx inside Markdown
import { useState } from 'react';
const [state, setState] = useState([
  {
    startDate: new Date(),
    endDate: null,
    key: 'selection'
  }
]);

<DateRange
  editableDateInputs={true}
  onChange={item => setState([item.selection])}
  moveRangeOnFirstSelection={false}
  ranges={state}
/>;
```

#### Example: Equal Length Ranges

```jsx inside Markdown
import { useState } from 'react';
const [state, setState] = useState([
  {
    startDate: new Date(),
    endDate: addDays(new Date(), 7),
    key: 'firstRange'
  },
  {
    startDate: null,
    endDate: null,
    key: 'secondRange'
  }
]);

<DateRange
  equalLengthRanges={true}
  onChange={item => setState([item.firstRange, item.secondRange])}
  ranges={state}
/>;
```

_Note: When `equalLengthRanges` is enabled, all ranges after the first will automatically have the same duration as the first range. In this example, both ranges will always be 7 days long._
