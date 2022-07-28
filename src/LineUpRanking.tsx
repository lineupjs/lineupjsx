import {
  builderAdapter,
  IBuilderAdapterImposeColumnProps,
  IBuilderAdapterNestedColumnProps,
  IBuilderAdapterRankingProps,
  IBuilderAdapterReduceColumnProps,
  IBuilderAdapterScriptColumnProps,
  IBuilderAdapterSupportColumnProps,
  IBuilderAdapterWeightedSumColumnProps,
  IImposeColumnBuilder,
  INestedBuilder,
  IReduceBuilder,
  IScriptedBuilder,
  IWeightedSumBuilder,
  LocalDataProvider,
  Ranking,
} from 'lineupjs';
import * as React from 'react';
import { filterChildrenProps } from './utils';

export declare type ILineUpRankingProps = IBuilderAdapterRankingProps;

export abstract class ALineUpColumnBuilder<T> extends React.PureComponent<React.PropsWithChildren<Readonly<T>>> {}

export interface IReactChildren {
  children: React.ReactNode;
}

export default class LineUpRanking extends React.PureComponent<React.PropsWithChildren<Readonly<ILineUpRankingProps>>> {
  static merge(props: ILineUpRankingProps & IReactChildren): ILineUpRankingProps {
    const inline: (
      | string
      | IImposeColumnBuilder
      | INestedBuilder
      | IWeightedSumBuilder
      | IReduceBuilder
      | IScriptedBuilder
    )[] = filterChildrenProps<ALineUpColumnBuilder<any>>(props.children, ALineUpColumnBuilder).map((c) =>
      c.type.build(c.props)
    );

    const columns = (props.columns || []).concat(inline);

    const r = { ...props, columns };
    delete r.children;
    return r;
  }

  /*
   * build the column description
   */
  static build(props: ILineUpRankingProps, data: LocalDataProvider): Ranking {
    return builderAdapter.buildRanking(props, data);
  }
}

export class LineUpColumn extends ALineUpColumnBuilder<{ column: '*' | string }> {
  static readonly build = builderAdapter.buildGeneric;
}

export declare type ILineUpImposeColumnProps = IBuilderAdapterImposeColumnProps;

export class LineUpImposeColumn extends ALineUpColumnBuilder<ILineUpImposeColumnProps> {
  static readonly build = builderAdapter.buildImposeRanking;
}

export declare type ILineUpNestedColumnProps = IBuilderAdapterNestedColumnProps;

export class LineUpNestedColumn extends ALineUpColumnBuilder<ILineUpNestedColumnProps> {
  static build(props: ILineUpNestedColumnProps & IReactChildren): INestedBuilder {
    return builderAdapter.buildNestedRanking(
      props,
      filterChildrenProps<LineUpColumn>(props.children, LineUpColumn).map((d) => d.type.build(d.props))
    );
  }
}

export class LineUpWeightedColumn extends ALineUpColumnBuilder<{ column: string; weight: number }> {
  static build(props: { column: string }) {
    return props.column;
  }

  get weight() {
    return this.props.weight;
  }
}

export declare type ILineUpWeightedSumColumnProps = IBuilderAdapterWeightedSumColumnProps & IReactChildren;

export class LineUpWeightedSumColumn extends ALineUpColumnBuilder<ILineUpWeightedSumColumnProps> {
  static build(props: ILineUpWeightedSumColumnProps & IReactChildren): IWeightedSumBuilder {
    const children = filterChildrenProps(props.children, LineUpWeightedColumn);
    return builderAdapter.buildWeightedSumRanking(
      props,
      children.map((d) => ({
        weight: d.props.weight,
        column: d.type.build(d.props),
      }))
    );
  }
}

export declare type ILineUpReduceColumnProps = IBuilderAdapterReduceColumnProps & { children: React.ReactNode };

export class LineUpReduceColumn extends ALineUpColumnBuilder<ILineUpReduceColumnProps> {
  static build(props: ILineUpReduceColumnProps & IReactChildren): IReduceBuilder {
    return builderAdapter.buildReduceRanking(
      props,
      filterChildrenProps<LineUpColumn>(props.children, LineUpColumn).map((d) => d.type.build(d.props))
    );
  }
}

export declare type ILineUpScriptColumnProps = IBuilderAdapterScriptColumnProps & { children: React.ReactNode };

export class LineUpScriptedColumn extends ALineUpColumnBuilder<ILineUpScriptColumnProps> {
  static build(props: ILineUpScriptColumnProps): IScriptedBuilder {
    return builderAdapter.buildScriptRanking(
      props,
      filterChildrenProps<LineUpColumn>(props.children, LineUpColumn).map((d) => d.type.build(d.props))
    );
  }
}

export declare type ILineUpSupportColumnProps = IBuilderAdapterSupportColumnProps;

export class LineUpSupportColumn extends ALineUpColumnBuilder<ILineUpSupportColumnProps> {
  static readonly build = builderAdapter.buildSupportRanking;
}

export class LineUpAllColumns extends ALineUpColumnBuilder<Record<string, never>> {
  static readonly build = builderAdapter.buildAllColumnsRanking;
}
