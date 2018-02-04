import {LocalDataProvider, Ranking, buildRanking, IImposeColumnBuilder, INestedBuilder, IWeightedSumBuilder, IReduceBuilder, IScriptedBuilder} from 'lineupjs';
import * as React from 'react';

export interface ILineUpRankingProps {
  sortBy?: (string|{column: string, asc: 'asc'|'desc'|boolean})|((string|{column: string, asc: 'asc'|'desc'|boolean})[]);
  groupBy?: string[]|string;
  columns?: (string | IImposeColumnBuilder | INestedBuilder | IWeightedSumBuilder | IReduceBuilder | IScriptedBuilder)[];
}

export default class LineUpRanking extends React.Component<Readonly<ILineUpRankingProps>, {}> {
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

    // TODO nested children

    return r.build(data);
  }
}
