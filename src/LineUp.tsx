import {
  builderAdapter,
  IBuilderAdapterProps,
  ILineUpOptions,
  ITaggleOptions,
  LineUp as LineUpImpl,
  LocalDataProvider,
  Taggle,
} from 'lineupjs';
import * as React from 'react';
import { LineUpColumnDesc } from './column';
import LineUpRanking from './LineUpRanking';
import { filterChildrenProps } from './utils';

export declare type ILineUpProps = IBuilderAdapterProps & { style?: React.CSSProperties; className?: string };

export class LineUp extends React.PureComponent<React.PropsWithChildren<Readonly<ILineUpProps>>> {
  private node: HTMLElement | null = null;

  private readonly adapter = new builderAdapter.Adapter({
    props: () => this.props,
    createInstance: (data: LocalDataProvider, options: Partial<ILineUpOptions>) =>
      this.createInstance(this.node!, data, options),
    columnDescs: (data: any[]) =>
      filterChildrenProps<LineUpColumnDesc, any>(this.props.children, LineUpColumnDesc).map((d) =>
        d.type.build(d.props, data)
      ),
    rankingBuilders: () =>
      filterChildrenProps<LineUpRanking>(this.props.children, LineUpRanking).map((d) => LineUpRanking.merge(d.props)),
  });

  protected createInstance(
    node: HTMLElement,
    data: LocalDataProvider,
    options: Partial<ITaggleOptions>
  ): LineUpImpl | Taggle {
    return new LineUpImpl(node, data, options);
  }

  componentDidMount() {
    this.adapter.componentDidMount();
  }

  componentDidUpdate(prevProps: Readonly<ILineUpProps>) {
    const props = this.props;
    this.adapter.componentDidUpdate((key: keyof ILineUpProps) => !builderAdapter.equal(props[key], prevProps[key]));
  }

  componentWillUnmount() {
    this.adapter.componentWillUnmount();
  }

  render() {
    const className = this.props.className ? `lu-wrapper ${this.props.className}` : 'lu-wrapper';
    return (
      <div className={className} style={this.props.style || {}}>
        <div ref={(d) => (this.node = d as HTMLElement)} />
      </div>
    );
  }
}
