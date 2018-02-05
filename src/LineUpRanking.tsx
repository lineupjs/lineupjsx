import {LocalDataProvider, Ranking, buildRanking, IImposeColumnBuilder, INestedBuilder, IWeightedSumBuilder, IReduceBuilder, IScriptedBuilder} from 'lineupjs';
import * as React from 'react';
import {filterChildren, filterChildrenProps} from './utils';

export interface ILineUpRankingProps {
  sortBy?: (string|{column: string, asc: 'asc'|'desc'|boolean})|((string|{column: string, asc: 'asc'|'desc'|boolean})[]);
  groupBy?: string[]|string;
  columns?: (string | IImposeColumnBuilder | INestedBuilder | IWeightedSumBuilder | IReduceBuilder | IScriptedBuilder)[];
}

export default class LineUpRanking extends React.PureComponent<Readonly<ILineUpRankingProps>, {}> {
  /*
   * build the column description
   */
  build(data: LocalDataProvider): Ranking {
    const r = buildRanking();

    if (this.props.sortBy) {
      const s = Array.isArray(this.props.sortBy)? this.props.sortBy :[this.props.sortBy];
      s.forEach((si) => {
        if (typeof si === 'string') {
          r.sortBy(si);
        } else {
          r.sortBy(si.column, si.asc);
        }
      });
    }
    if (this.props.groupBy) {
      const s = Array.isArray(this.props.groupBy)? this.props.groupBy :[this.props.groupBy];
      r.groupBy(...s);
    }
    if (this.props.columns) {
      this.props.columns.forEach((c) => r.column(c));
    }

    filterChildren<ALineUpColumnBuilder<any>>(this.props.children, ALineUpColumnBuilder).forEach((c) => r.column(c.build()));

    return r.build(data);
  }
}

export abstract class ALineUpColumnBuilder<T> extends React.PureComponent<Readonly<T>, {}> {

}

export class LineUpColumn extends ALineUpColumnBuilder<{column: '*'|string}> {
  static build(props: {column: '*'|string}) {
    return props.column;
  }
}

export interface ILineUpImposeColumnProps {
  label?: string;
  column: string;
  categoricalColumn: string;
}

export class LineUpImposeColumn extends ALineUpColumnBuilder<ILineUpImposeColumnProps> {
  static build(props: ILineUpImposeColumnProps) {
    return Object.assign({
      type: 'impose'
    }, props) as any;
  }
}

export class LineUpNestedColumn extends ALineUpColumnBuilder<{label?: string}> {
  build() {
    const r: INestedBuilder = {
      type: 'nested',
      columns: filterChildrenProps<LineUpColumn>(this.props.children, LineUpColumn).map((d) => d.type.build(d.props))
    };
    if (this.props.label) {
      r.label = this.props.label;
    }
    return r;
  }
}

export class LineUpWeightedColumn extends ALineUpColumnBuilder<{column: string, weight: number}> {
  build() {
    return this.props.column;
  }

  get weight() {
    return this.props.weight;
  }
}

export interface ILineUpWeightedSumColumnProps {
  label?: string;
  children: React.ReactNode;
}

export class LineUpWeightedSumColumn extends ALineUpColumnBuilder<ILineUpWeightedSumColumnProps> {
  static build(props: ILineUpWeightedSumColumnProps) {
    const children = filterChildrenProps<LineUpWeightedColumn>(props.children, LineUpWeightedColumn);
    const r: IWeightedSumBuilder = {
      type: 'weightedSum',
      columns: children.map((d) => d.type.build(d.props)),
      weights: children.map((d) => d.props.weight)
    };
    if (props.label) {
      r.label = props.label;
    }
    return r;
  }
}

export interface ILineUpReduceColumnProps {
  type: 'min' | 'max' | 'mean' | 'median';
  label?: string;
  children: React.ReactNode;
}

export class LineUpReduceColumn extends ALineUpColumnBuilder<ILineUpReduceColumnProps> {
  static build(props: ILineUpReduceColumnProps) {
    const r: IReduceBuilder = {
      type: props.type,
      columns: filterChildrenProps<LineUpColumn>(props.children, LineUpColumn).map((d) => d.type.build(d.props))
    };
    if (props.label) {
      r.label = props.label;
    }
    return r;
  }
}

export interface ILineUpScriptColumnProps {
  code: string;
  label?: string;
  children: React.ReactNode;
}

export class LineUpScriptedColumn extends ALineUpColumnBuilder<ILineUpScriptColumnProps> {
  static build(props: ILineUpScriptColumnProps) {
    const r: IScriptedBuilder = {
      type: 'script',
      code: props.code,
      columns: filterChildrenProps<LineUpColumn>(props.children, LineUpColumn).map((d) => d.type.build(d.props))
    };
    if (props.label) {
      r.label = props.label;
    }
    return r;
  }
}

export interface ILineUpSupportColumnProps {
  type: 'rank'|'selection'|'group'|'aggregate'|'*';
}

export class LineUpSupportColumn extends ALineUpColumnBuilder<ILineUpSupportColumnProps> {
  static build(props: ILineUpSupportColumnProps) {
    return `_${props.type}`;
  }
}

export class LineUpAllColumns extends ALineUpColumnBuilder<{}> {
  static build() {
    return '*';
  }
}
