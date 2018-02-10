import {
  builderAdapter,
  IBuilderAdapterCategoricalColumnDescProps,
  IBuilderAdapterColumnDescProps,
  IBuilderAdapterDateColumnDescProps,
  IBuilderAdapterHierarchyColumnDescProps,
  IBuilderAdapterNumberColumnDescProps,
  IBuilderAdapterStringColumnDescProps,
  ICategoricalColumnDesc,
  IColumnDesc,
  IDateColumnDesc,
  IHierarchyColumnDesc,
  INumberColumnDesc,
  IStringColumnDesc
} from 'lineupjs';
import * as React from 'react';

export declare type ILineUpColumnDescProps = IBuilderAdapterColumnDescProps;
export declare type ILineUpCategoricalColumnDescProps = IBuilderAdapterCategoricalColumnDescProps;
export declare type ILineUpDateColumnDescProps = IBuilderAdapterDateColumnDescProps;
export declare type ILineUpNumberColumnDescProps = IBuilderAdapterNumberColumnDescProps;
export declare type ILineUpHierarchyColumnDescProps = IBuilderAdapterHierarchyColumnDescProps;
export declare type ILineUpStringColumnDescProps = IBuilderAdapterStringColumnDescProps;

export class LineUpColumnDesc<P extends ILineUpColumnDescProps = ILineUpColumnDescProps> extends React.PureComponent<Readonly<P>, {}> {
  static build<P extends ILineUpColumnDescProps>(props: P, _data: any[]): IColumnDesc {
    return builderAdapter.build(props);
  }
}

export class LineUpCategoricalColumnDesc extends LineUpColumnDesc<ILineUpCategoricalColumnDescProps> {
  static build(props: ILineUpCategoricalColumnDescProps, data: any[]): ICategoricalColumnDesc {
    return builderAdapter.buildCategorical(props, data);
  }
}

export class LineUpDateColumnDesc extends LineUpColumnDesc<ILineUpDateColumnDescProps> {
  static build(props: ILineUpDateColumnDescProps): IDateColumnDesc {
    return builderAdapter.buildDate(props);
  }
}

export class LineUpHierarchyColumnDesc extends LineUpColumnDesc<ILineUpHierarchyColumnDescProps> {
  static build(props: any): IHierarchyColumnDesc {
    return builderAdapter.buildHierarchy(props);
  }
}

export class LineUpNumberColumn extends LineUpColumnDesc<ILineUpNumberColumnDescProps> {
  static build(props: ILineUpNumberColumnDescProps, data: any[]): INumberColumnDesc {
    return builderAdapter.buildNumber(props, data);
  }
}

export class LineUpStringColumnDesc extends LineUpColumnDesc<ILineUpStringColumnDescProps> {
  static build(props: ILineUpStringColumnDescProps): IStringColumnDesc {
    return builderAdapter.buildString(props);
  }
}
