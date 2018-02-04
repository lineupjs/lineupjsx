import * as React from 'react';
import * as ReactDOM from 'react-dom';
import LineUp, {LineUpCategoricalColumnDesc, LineUpNumberColumnDesc, LineUpStringColumnDesc} from '../src';

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

function builder2() {
  return <LineUp data={arr} sidePanel sidePanelCollapsed defaultRanking>
    <LineUpStringColumnDesc column="d" label="Label" width={100} />
    <LineUpCategoricalColumnDesc column="cat" categories={cats} color="green" />
    <LineUpCategoricalColumnDesc column="cat2" categories={cats} color="blue" />
    <LineUpNumberColumnDesc column="a" domain={[0, 10]} color="blue" />
    <LineUpRanking groupBy="cat" sortBy="a:desc">

    </LineUpRanking>
  </LineUp>;
}
/*
const builder = LineUpJS.builder(arr);

// and two rankings
const ranking = LineUpJS.buildRanking()
  .supportTypes()
  .allColumns() // add all columns
  .groupBy('cat')
  .sortBy('a', 'desc')
  .impose('number', 'a', 'cat2'); // create composite column

builder
  .defaultRanking()
  .ranking(ranking);

const lineup = builder.build(document.body);
*/

ReactDOM.render(
  React.createElement(builder2),
  document.querySelector('div')
);
