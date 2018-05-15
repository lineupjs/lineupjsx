import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as LineUpJS from '../src';

function data() {
  const arr = [];
  for (let i = 0; i < 100; ++i) {
    arr.push({
      a: (i * 999) % 11,
      d: `Row ${i}`,
    });
  }
    return arr;
 }

const d = data();

class Render extends React.Component<any, any> {
  constructor(props: any, ctx: any) {
    super(props, ctx);
    this.state = {
      highlight: -1,
      selection: []
    };
  }

  private readonly onHighlightChanged = (highlight: number) => {
    console.log(highlight);
    this.setState({highlight});
  };

  private readonly onSelect = (selection: number[]) => {
    this.setState({selection});
  }

  render() {
    return <div>
      <LineUpJS.LineUp data={d}
              onSelectionChanged={this.onSelect}
              onHighlightChanged={this.onHighlightChanged}
              selection={this.state.selection}
              highlight={this.state.highlight}
              >
                  <LineUpJS.LineUpStringColumnDesc column="d" label="Label" width={80} />
          <LineUpJS.LineUpNumberColumnDesc column="a" label="other label" width={160} />
        </LineUpJS.LineUp>
      <button onClick={() => this.setState({highlight: this.state.highlight + 10})}>Highlight</button>
      </div>;
  }
}

ReactDOM.render(React.createElement(Render), document.querySelector('body'));
