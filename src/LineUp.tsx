import * as React from 'react';
import {LocalDataProvider, ITaggleOptions, LineUp as LineUpImpl, Taggle} from 'lineupjs';

export interface ILineUpProps {
  data: any[];
  selection?: number[];

  onSelectionChanged?(selection: number[]): void;
}

export interface ILineUpState {
  data: LocalDataProvider;
  config: ITaggleOptions;
}

export default class LineUp extends React.Component<ILineUpProps, ILineUpState> {
  private data: LocalDataProvider;
  private instance: LineUpImpl|Taggle;

  protected createInstance(node: HTMLElement, data: LocalDataProvider, options: ITaggleOptions): LineUpImpl|Taggle {
    return new LineUpImpl(node, data, options);
  }

  render() {
    return (
      <h2>
        Hello
      </h2>
    );
  }
}
