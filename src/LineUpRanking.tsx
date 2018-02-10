import {
  builderAdapter,
  IBuilderAdapterImposeColumnProps,
  IBuilderAdapterRankingProps,
  IBuilderAdapterReduceColumnProps,
  IBuilderAdapterStringColumnProps,
  IBuilderAdapterSupportColumnProps,
  IBuilderAdapterWeightedSumColumnProps
} from 'lineupjs';
import * as React from 'react';
import {filterChildrenProps} from './utils';

export declare type ILineUpRankingProps = IBuilderAdapterRankingProps;

export abstract class ALineUpColumnBuilder<T> extends React.PureComponent<Readonly<T>, {}> {

}

export default class LineUpRanking extends React.PureComponent<Readonly<ILineUpRankingProps>, {}> {
  static merge(props: ILineUpRankingProps) {
    const inline = filterChildrenProps<ALineUpColumnBuilder<any>>(props.children, ALineUpColumnBuilder).map((c) => c.type.build(c.props));

    const columns = (props.columns || []).concat(inline);

    const r = {...props, columns};
    delete r.children;
    return r;
  }

  /*
   * build the column description
   */
  static readonly build = builderAdapter.buildRanking;
}

export class LineUpColumn extends ALineUpColumnBuilder<{ column: '*' | string }> {
  static readonly build = builderAdapter.buildGeneric;
}

export declare type ILineUpImposeColumnProps = IBuilderAdapterImposeColumnProps;

export class LineUpImposeColumn extends ALineUpColumnBuilder<ILineUpImposeColumnProps> {
  static readonly build = builderAdapter.buildImposeRanking;
}

export class LineUpNestedColumn extends ALineUpColumnBuilder<{ label?: string }> {
  static readonly build = builderAdapter.buildNestedRanking;
}

export class LineUpWeightedColumn extends ALineUpColumnBuilder<{ column: string, weight: number }> {
  build() {
    return this.props.column;
  }

  get weight() {
    return this.props.weight;
  }
}

export declare type ILineUpWeightedSumColumnProps =
  IBuilderAdapterWeightedSumColumnProps
  & { children: React.ReactNode };

export class LineUpWeightedSumColumn extends ALineUpColumnBuilder<ILineUpWeightedSumColumnProps> {
  static build(props: ILineUpWeightedSumColumnProps) {
    return builderAdapter.buildWeightedSumRanking(props, props.children.map((d) => ({
      weight: d.props.weight,
      column: d.type.build(d.props)
    })));
  }
}

export declare type ILineUpReduceColumnProps = IBuilderAdapterReduceColumnProps & { children: React.ReactNode };


export class LineUpReduceColumn extends ALineUpColumnBuilder<ILineUpReduceColumnProps> {
  static build(props: ILineUpReduceColumnProps) {
    return builderAdapter.buildReduceRanking(props, filterChildrenProps<LineUpColumn>(props.children, LineUpColumn).map((d) => d.type.build(d.props)));
  }
}

export declare type ILineUpScriptColumnProps = IBuilderAdapterStringColumnProps & { children: React.ReactNode };

export class LineUpScriptedColumn extends ALineUpColumnBuilder<ILineUpScriptColumnProps> {
  static build(props: ILineUpScriptColumnProps) {
    return builderAdapter.buildScriptRanking(props, filterChildrenProps<LineUpColumn>(props.children, LineUpColumn).map((d) => d.type.build(d.props)));
  }
}

export declare type ILineUpSupportColumnProps = IBuilderAdapterSupportColumnProps;

export class LineUpSupportColumn extends ALineUpColumnBuilder<ILineUpSupportColumnProps> {
  static readonly build = builderAdapter.buildSupportRanking;
}

export class LineUpAllColumns extends ALineUpColumnBuilder<{}> {
  static readonly build = builderAdapter.buildAllColumnsRanking;
}
