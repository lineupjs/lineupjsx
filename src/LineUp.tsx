import * as React from 'react';
import {LocalDataProvider, ITaggleOptions, LineUp as LineUpImpl, Taggle, Column, ICellRendererFactory, IToolbarAction, Ranking, IDynamicHeight, IGroupItem, IGroupData} from 'lineupjs';
import * as equal from 'fast-deep-equal';
import {isSame} from './utils';

export interface ILineUpDataProps {
  data: any[];
  selection?: number[];

  onSelectionChanged?(selection: number[]): void;

  singleSelection?: boolean;
  filterGlobally?: boolean;
  noCriteriaLimits?: boolean;
  maxGroupColumns?: number;
  maxNestedSortingCriteria?: number;
  columnTypes?: {[type: string]: typeof Column};

  deriveColumns?: boolean|string[];
  deriveColors?: boolean;

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
  toolbar?: { [id: string] : IToolbarAction};

  rowHeight?: number;
  rowPadding?: number;

  groupHeight?: number;
  groupPadding?: number;

  dynamicHeight?: (data: (IGroupItem | IGroupData)[], ranking: Ranking) => (IDynamicHeight | null);
}

export default class LineUp extends React.Component<Readonly<ILineUpProps>, {}> {
  private data: LocalDataProvider|null = null;
  private instance: LineUpImpl|Taggle|null = null;
  private node: HTMLElement;

  private readonly onSelectionChanged = (indices: number[]) => {
    if (this.props.onSelectionChanged) {
      this.props.onSelectionChanged(indices);
    }
  }

  protected createInstance(node: HTMLElement, data: LocalDataProvider, options: ITaggleOptions): LineUpImpl|Taggle {
    return new LineUpImpl(node, data, options);
  }

  componentDidMount() {
    // TODO
  }

  componentDidUpdate(prevProps: Readonly<ILineUpProps>) {
    // TODO
    if (!this.data) {
      return;
    }

    const dataProviderOptionsChanged = isSame(this.props, prevProps, 'singleSelection', 'filterGlobally', 'noCriteriaLimits', 'maxGroupColumns', 'maxNestedSortingCriteria', 'columnTypes');
    const lineupOptionsChanged = isSame(this.props, prevProps, 'animated', 'sidePanel', 'sidePanelCollapsed', 'defaultSlopeGraphMode', 'summaryHeader', 'expandLineOnHover', 'overviewMode', 'renderer', 'toolbar', 'rowHeight', 'rowPadding', 'groupHeight', 'groupPadding', 'dynamicHeight');


    this.data.on(LocalDataProvider.EVENT_SELECTION_CHANGED, null);
    this.data.setSelection(this.props.selection || []);
    this.data.on(LocalDataProvider.EVENT_SELECTION_CHANGED, this.onSelectionChanged);
  }



  componentWillUnmount() {
    if (this.instance) {
      this.instance.destroy();
      this.instance = null;
    }
    this.data = null;
  }

  render() {
    return <div ref={(d) => this.node = d as HTMLElement} className="lu-wrapper"/>;
  }
}
