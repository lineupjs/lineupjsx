import {LocalDataProvider, Ranking, buildRanking, IImposeColumnBuilder, INestedBuilder, IWeightedSumBuilder, IReduceBuilder, IScriptedBuilder} from 'lineupjs';
import * as React from 'react';
import {filterChildren} from './utils';

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
  abstract build(): string | IImposeColumnBuilder | INestedBuilder | IWeightedSumBuilder | IReduceBuilder | IScriptedBuilder;
}

export class LineUpColumn extends ALineUpColumnBuilder<{column: string, weight?: number}> {
  build() {
    return this.props.column;
  }

  get weight() {
    return this.props.weight;
  }
}

export class LineUpImposeColumn extends ALineUpColumnBuilder<{label?: string, column: string, categoricalColumn: string}> {
  build() {
    return Object.assign({
      type: 'impose'
    }, this.props) as any;
  }
}

export class LineUpNestedColumn extends ALineUpColumnBuilder<{label?: string}> {
  build() {
    const r: INestedBuilder = {
      type: 'nested',
      columns: filterChildren<LineUpColumn>(this.props.children, LineUpColumn).map((d) => d.build())
    };
    if (this.props.label) {
      r.label = this.props.label;
    }
    return r;
  }
}

export class LineUpWeightedSumColumn extends ALineUpColumnBuilder<{label?: string}> {
  build() {
    const children = filterChildren<LineUpColumn>(this.props.children, LineUpColumn);
    const r: IWeightedSumBuilder = {
      type: 'weightedSum',
      columns: children.map((d) => d.build()),
      weights: children.map((d) => d.weight || 0)
    };
    if (this.props.label) {
      r.label = this.props.label;
    }
    return r;
  }
}

export class LineUpReduceColumn extends ALineUpColumnBuilder<{type: 'min' | 'max' | 'mean' | 'median', label?: string}> {
  build() {
    const r: IReduceBuilder = {
      type: this.props.type,
      columns: filterChildren<LineUpColumn>(this.props.children, LineUpColumn).map((d) => d.build())
    };
    if (this.props.label) {
      r.label = this.props.label;
    }
    return r;
  }
}

export class LineUpScriptedColumn extends ALineUpColumnBuilder<{code: string, label?: string}> {
  build() {
    const r: IScriptedBuilder = {
      type: 'script',
      code: this.props.code,
      columns: filterChildren<LineUpColumn>(this.props.children, LineUpColumn).map((d) => d.build())
    };
    if (this.props.label) {
      r.label = this.props.label;
    }
    return r;
  }
}

export class LineUpSupportColumn extends ALineUpColumnBuilder<{type: 'rank'|'selection'|'group'|'aggregate'|'*'}> {
  build() {
    return `_${this.props.type}`;
  }
}

export class LineUpAllColumns extends ALineUpColumnBuilder<{}> {
  build() {
    return '*';
  }
}
