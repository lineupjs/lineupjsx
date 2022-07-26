import {
  builderAdapter,
  IBuilderAdapterCategoricalColumnDescProps,
  IBuilderAdapterColumnDescProps,
  IBuilderAdapterDateColumnDescProps,
  IBuilderAdapterHierarchyColumnDescProps,
  IBuilderAdapterNumberColumnDescProps,
  IBuilderAdapterStringColumnDescProps,
  IBuilderAdapterActionsColumnDescProps,
  IBuilderAdapterBooleanColumnDescProps,
  ICategoricalColumnDesc,
  IColumnDesc,
  IDateColumnDesc,
  IHierarchyColumnDesc,
  INumberColumnDesc,
  IActionColumnDesc,
  ILinkColumnDesc,
  IBooleanColumnDesc,
} from 'lineupjs';
import * as React from 'react';

export declare type ILineUpColumnDescProps = IBuilderAdapterColumnDescProps;
export declare type ILineUpCategoricalColumnDescProps = IBuilderAdapterCategoricalColumnDescProps;
export declare type ILineUpBooleanColumnDescProps = IBuilderAdapterBooleanColumnDescProps;
export declare type ILineUpDateColumnDescProps = IBuilderAdapterDateColumnDescProps;
export declare type ILineUpNumberColumnDescProps = IBuilderAdapterNumberColumnDescProps;
export declare type ILineUpHierarchyColumnDescProps = IBuilderAdapterHierarchyColumnDescProps;
export declare type ILineUpStringColumnDescProps = IBuilderAdapterStringColumnDescProps;
export declare type ILineUpActionsColumnDescProps = IBuilderAdapterActionsColumnDescProps;

export class LineUpColumnDesc<P extends ILineUpColumnDescProps = ILineUpColumnDescProps> extends React.PureComponent<
  Readonly<P>,
  unknown
> {
  static build<P extends ILineUpColumnDescProps>(props: P, _data: any[]): IColumnDesc {
    return builderAdapter.build(props);
  }
}

export class LineUpCategoricalColumnDesc extends LineUpColumnDesc<ILineUpCategoricalColumnDescProps> {
  static build(props: ILineUpCategoricalColumnDescProps, data: any[]): ICategoricalColumnDesc {
    return builderAdapter.buildCategorical(props, data);
  }
}

export class LineUpBooleanColumnDesc extends LineUpColumnDesc<ILineUpBooleanColumnDescProps> {
  static build(props: ILineUpBooleanColumnDescProps, _data: any[]): IBooleanColumnDesc {
    return builderAdapter.buildBoolean(props);
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

export class LineUpNumberColumnDesc extends LineUpColumnDesc<ILineUpNumberColumnDescProps> {
  static build(props: ILineUpNumberColumnDescProps, data: any[]): INumberColumnDesc {
    return builderAdapter.buildNumber(props, data);
  }
}

export class LineUpStringColumnDesc extends LineUpColumnDesc<ILineUpStringColumnDescProps> {
  static build(props: ILineUpStringColumnDescProps): ILinkColumnDesc {
    return builderAdapter.buildString(props);
  }
}

export class LineUpActionsColumnDesc extends LineUpColumnDesc<ILineUpActionsColumnDescProps> {
  static build(props: ILineUpActionsColumnDescProps): IActionColumnDesc {
    return builderAdapter.buildActions(props);
  }
}
