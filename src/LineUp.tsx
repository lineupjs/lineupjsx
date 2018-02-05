import * as React from 'react';
import {LocalDataProvider, ITaggleOptions, LineUp as LineUpImpl, Taggle, Column, ICellRendererFactory, IToolbarAction, Ranking, IDynamicHeight, IGroupItem, IGroupData, deriveColors, deriveColumnDescriptions} from 'lineupjs';
import * as equal from 'fast-deep-equal';
import {filterChildren, pick, isSame, filterChildrenProps} from './utils';
import LineUpColumnDesc from './column/LineUpColumnDesc';
import LineUpRanking from './LineUpRanking';

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

const providerOptions: (keyof ILineUpDataProps)[] = ['singleSelection', 'filterGlobally', 'noCriteriaLimits', 'maxGroupColumns', 'maxNestedSortingCriteria', 'columnTypes'];
const lineupOptions: (keyof ILineUpProps)[] = ['animated', 'sidePanel', 'sidePanelCollapsed', 'defaultSlopeGraphMode', 'summaryHeader', 'expandLineOnHover', 'overviewMode', 'renderer', 'toolbar', 'rowHeight', 'rowPadding', 'groupHeight', 'groupPadding', 'dynamicHeight'];

export default class LineUp extends React.Component<Readonly<ILineUpProps>, {}> {
  private data: LocalDataProvider|null = null;
  private instance: LineUpImpl|Taggle|null = null;
  private node: HTMLElement;

  private readonly onSelectionChanged = (indices: number[]) => {
    if (this.props.onSelectionChanged) {
      this.props.onSelectionChanged(indices);
    }
  }

  protected createInstance(node: HTMLElement, data: LocalDataProvider, options: Partial<ITaggleOptions>): LineUpImpl|Taggle {
    return new LineUpImpl(node, data, options);
  }

  componentDidMount() {
    this.data = this.buildProvider();
    this.instance = this.createInstance(this.node, this.data, pick(this.props, lineupOptions));
  }

  private buildProvider() {
    const columns = this.buildColumns(this.props.data);
    const data = new LocalDataProvider(this.props.data, columns, pick(this.props, providerOptions));

    this.buildRankings(data);

    data.setSelection(this.props.selection || []);
    data.on(LocalDataProvider.EVENT_SELECTION_CHANGED, this.onSelectionChanged);

    return data;
  }

  private resolveColumnDescs(data: any[]) {
    return filterChildrenProps<LineUpColumnDesc, any>(this.props.children, LineUpColumnDesc).map((d) => d.type.build(d.props, data));
  }

  private buildColumns(data: any[]) {
    const columns = this.resolveColumnDescs(data);
    if (columns.length === 0 || this.props.deriveColumns) {
      columns.push(...deriveColumnDescriptions(data, {columns: Array.isArray(this.props.deriveColumns) ? this.props.deriveColumns: []}));
    }
    if (this.props.deriveColors) {
      deriveColors(columns);
    }
    return columns;
  }

  private buildRankings(data: LocalDataProvider) {
    if (!data) {
      return;
    }
    const builders = filterChildren<LineUpRanking>(this.props.children, LineUpRanking);
    if ((builders.length === 0 && !this.props.restore) || this.props.defaultRanking) {
      data.deriveDefault(this.props.defaultRanking !== 'noSupportTypes');
    }
    if (this.props.restore) {
      data.restore(this.props.restore);
    }
    builders.forEach((b) => b.build(data!));
  }

  private updateLineUp(prevProps: Readonly<ILineUpProps>) {
    // check lineup instance properties
    const changedLineUpOptions = isSame(this.props, prevProps, lineupOptions);
    if (!changedLineUpOptions) {
      return;
    }
    // recreate lineup
    if (this.instance) {
      this.instance.destroy();
    }
    console.log('recreating lineup instance');
    this.instance = this.createInstance(this.node, this.data!, changedLineUpOptions);
  }

  private updateProvider(prevProps: Readonly<ILineUpProps>) {
    const changedProviderOptions = isSame(this.props, prevProps, providerOptions);
    if (changedProviderOptions || !this.data) {
      // big change start from scratch
      this.data = this.buildProvider();
      return;
    }

    const dataChanged = prevProps.data !== this.props.data && !equal(this.props.data, prevProps.data);
    // TODO check column descriptions
    {
      const columns = this.resolveColumnDescs(this.props.data);
      if (dataChanged && (columns.length === 0 || this.props.deriveColumns)) {
        // new derived columns
      }
    }

    if (dataChanged) {
      this.data.setData(this.props.data);
    }

    // TODO check ranking definitions
    {
      const builders = filterChildren<LineUpRanking>(this.props.children, LineUpRanking);
      if ((builders.length === 0 && !this.props.restore) || this.props.defaultRanking) {
        this.data.deriveDefault(this.props.defaultRanking !== 'noSupportTypes');
      }
      if (this.props.restore) {
        this.data.restore(this.props.restore);
      }
      builders.forEach((b) => b.build(this.data!));
    }

    this.data.on(LocalDataProvider.EVENT_SELECTION_CHANGED, null);
    this.data.setSelection(this.props.selection || []);
    this.data.on(LocalDataProvider.EVENT_SELECTION_CHANGED, this.onSelectionChanged);
  }

  componentDidUpdate(prevProps: Readonly<ILineUpProps>) {
    this.updateProvider(prevProps);
    this.updateLineUp(prevProps);
  }



  componentWillUnmount() {
    if (this.instance) {
      this.instance.destroy();
      this.instance = null;
    }
    this.data = null;
  }

  render() {
    return <div className="lu-wrapper">
      <div ref={(d) => this.node = d as HTMLElement}/>
    </div>;
  }
}
