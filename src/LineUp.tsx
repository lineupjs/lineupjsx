import * as React from 'react';
import {LocalDataProvider, ITaggleOptions, LineUp as LineUpImpl, Taggle, Column, ICellRendererFactory, IToolbarAction, Ranking, IDynamicHeight, IGroupItem, IGroupData} from 'lineupjs';

export interface ILineUpDataProps {
  data: any[];
  selection?: number[];

  onSelectionChanged?(selection: number[]): void;

  singleSelection?: boolean;
  filterGlobally?: boolean;
  noCriteriaLimits?: boolean;
  maxGroupColumns?: number;
  maxNestedSortingCriteria?: number;
  deriveColumns?: boolean|string[];
  deriveColors?: boolean;
  columnTypes?: {[type: string]: typeof Column};

  restore?: any;
  defaultRanking?: boolean|'noSupportTypes';
}

export interface ILineUpProps extends ILineUpDataProps {
  animated?: boolean;
  sidePanel?: boolean;
  sidePanelCollapsed?: boolean;
  defaultSlopeGraphMode?: 'item'|'band';
  summaryHeader?: boolean;
  expandLineOnHover?: boolean;
  overviewMode?: boolean;

  renderer?: { [id: string] : ICellRendererFactory};
  toolbar?: { [id: string] : IToolbarAction}

  rowHeight?: number;
  rowPadding?: number;

  groupHeight?: number;
  groupPadding?: number;

  dynamicHeight?: (data: (IGroupItem | IGroupData)[], ranking: Ranking) => (IDynamicHeight | null);
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
