import * as React from 'react';
import * as ReactDOM from 'react-dom';
import LineUp from '../src';

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
  return <LineUp data={arr} />;
}
/*
const builder = LineUpJS.builder(arr);

// manually define columns
builder
  .sidePanel(true, true)
  .column(LineUpJS.buildStringColumn('d').label('Label').width(100))
  .column(LineUpJS.buildCategoricalColumn('cat', cats).color('green'))
  .column(LineUpJS.buildCategoricalColumn('cat2', cats).color('blue'))
  .column(LineUpJS.buildNumberColumn('a', [0, 10]).color('blue'));

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
