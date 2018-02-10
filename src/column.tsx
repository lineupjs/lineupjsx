import {
  builderAdapter, IBuilderAdapterCategoricalColumnDescProps, IBuilderAdapterColumnDescProps,
  IBuilderAdapterDateColumnDescProps,
  IBuilderAdapterHierarchyColumnDescProps,
  IBuilderAdapterNumberColumnDescProps,
  IBuilderAdapterStringColumnDescProps,
} from 'lineupjs';
import * as React from 'react';
import {
  IImposeColumnBuilder, INestedBuilder, IReduceBuilder, IScriptedBuilder,
  IWeightedSumBuilder
} from '../../lineupjs/src/builder/index';

export declare type ILineUpColumnDescProps = IBuilderAdapterColumnDescProps;
export declare type ILineUpCategoricalColumnDescProps = IBuilderAdapterCategoricalColumnDescProps;
export declare type ILineUpDateColumnDescProps = IBuilderAdapterDateColumnDescProps;
export declare type ILineUpNumberColumnDescProps = IBuilderAdapterNumberColumnDescProps;
export declare type ILineUpHierarchyColumnDescProps = IBuilderAdapterHierarchyColumnDescProps;
export declare type ILineUpStringColumnDescProps = IBuilderAdapterStringColumnDescProps;

export class LineUpColumnDesc<P extends ILineUpColumnDescProps = ILineUpColumnDescProps> extends React.PureComponent<Readonly<P>, {}> {
  static build<P extends ILineUpColumnDescProps>(props: P): (string | IImposeColumnBuilder | INestedBuilder | IWeightedSumBuilder | IReduceBuilder | IScriptedBuilder) {
    return builderAdapter.buildGeneric(props);
  }
}

export class LineUpCategoricalColumnDesc extends LineUpColumnDesc<ILineUpCategoricalColumnDescProps> {
  static readonly build = builderAdapter.buildCategorical;
}

export class LineUpDateColumnDesc extends LineUpColumnDesc<ILineUpDateColumnDescProps> {
  static readonly build = builderAdapter.buildDate;
}

export class LineUpHierarchyColumnDesc extends LineUpColumnDesc<ILineUpHierarchyColumnDescProps> {
  static readonly build = builderAdapter.buildHierarchy;
}

export class LineUpNumberColumn extends LineUpColumnDesc<ILineUpNumberColumnDescProps> {
  static readonly build = builderAdapter.buildNumber;
}

export class LineUpStringColumnDesc extends LineUpColumnDesc<ILineUpStringColumnDescProps> {
  static readonly build = builderAdapter.buildString;
}
