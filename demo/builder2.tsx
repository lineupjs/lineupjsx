import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {IAction} from 'lineupjs';
import LineUp, {LineUpCategoricalColumnDesc, LineUpNumberColumnDesc, LineUpStringColumnDesc, LineUpRanking, LineUpColumn, LineUpSupportColumn, LineUpActionsColumnDesc} from '../src';

const arr: any[] = [];
const cats = ['c1', 'c2', 'c3'];
for (let i = 0; i < 100; ++i) {
  arr.push({
    a: Math.random() * 10,
    d: `Row ${i}`,
    cat: cats[Math.floor(Math.random() * 3)],
    cat2: cats[Math.floor(Math.random() * 3)]
  });
}

const actions: IAction[] = [{
  name: 'Click me',
  icon: 'Click',
  action: (row) => console.log(row.v)
}];

function builder2() {
  return <LineUp data={arr} sidePanel sidePanelCollapsed defaultRanking style={{height: '500px'}}>
    <LineUpStringColumnDesc column="d" label="Label" width={100} />
    <LineUpCategoricalColumnDesc column="cat" categories={cats} color="green" />
    <LineUpCategoricalColumnDesc column="cat2" categories={cats} color="blue" />
    <LineUpNumberColumnDesc column="a" domain={[0, 10]} color="blue" />
    <LineUpActionsColumnDesc actions={actions} column="a"/>
    <LineUpRanking groupBy="cat" sortBy="a:desc">
      <LineUpSupportColumn type="*" />
      <LineUpColumn column="*" />
    </LineUpRanking>
  </LineUp>;
}

ReactDOM.render(
  React.createElement(builder2),
  document.querySelector('div')
);
