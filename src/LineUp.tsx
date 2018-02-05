import * as React from 'react';
import {LocalDataProvider, ITaggleOptions, IColumnDesc, LineUp as LineUpImpl, Taggle, Column, ICellRendererFactory, IToolbarAction, Ranking, IDynamicHeight, IGroupItem, IGroupData, deriveColors, deriveColumnDescriptions} from 'lineupjs';
import * as equal from 'fast-deep-equal';
import {pick, isSame, filterChildrenProps} from './utils';
import LineUpColumnDesc from './column/LineUpColumnDesc';
import LineUpRanking, {ILineUpRankingProps} from './LineUpRanking';

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

interface IRankingContext {
  builders: ILineUpRankingProps[];
  restore: any;
  derive: boolean;
  supportTypes: boolean;
}

interface IColumnContext {
  columns: IColumnDesc[];
  deriveColumns: boolean;
  deriveColumnNames: string[];
  deriveColors: boolean;
}

export default class LineUp extends React.Component<Readonly<ILineUpProps>, {}> {
  private data: LocalDataProvider|null = null;
  private instance: LineUpImpl|Taggle|null = null;
  private node: HTMLElement;

  private prevRankings: IRankingContext;
  private prevColumns: IColumnContext;

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

  private resolveColumnDescs(data: any[]): IColumnContext {
    const columns = filterChildrenProps<LineUpColumnDesc, any>(this.props.children, LineUpColumnDesc).map((d) => d.type.build(d.props, data));
    const deriveColumns = columns.length === 0 || Boolean(this.props.deriveColumns);
    const deriveColumnNames = Array.isArray(this.props.deriveColumns) ? this.props.deriveColumns: [];
    const deriveColors = Boolean(this.props.deriveColors);
    return {
      columns,
      deriveColors,
      deriveColumns,
      deriveColumnNames
    }
  }

  private resolveRankings(): IRankingContext {
    const builders = filterChildrenProps<LineUpRanking>(this.props.children, LineUpRanking).map((d) => LineUpRanking.merge(d.props));

    return {
      builders,
      restore: this.props.restore,
      derive: (builders.length === 0 && !this.props.restore) || Boolean(this.props.defaultRanking),
      supportTypes: this.props.defaultRanking !== 'noSupportTypes'
    };
  }

  private buildColumns(data: any[], ctx: IColumnContext) {
    console.log('build columns');
    this.prevColumns = ctx;
    const columns = ctx.columns.slice();
    if (ctx.deriveColumns) {
      columns.push(...deriveColumnDescriptions(data, {columns: ctx.deriveColumnNames}));
    }
    if (ctx.deriveColors) {
      deriveColors(columns);
    }
    return columns;
  }

  private buildRankings(data: LocalDataProvider, rankings: IRankingContext) {
    console.log('build rankings');
    data.clearRankings();
    this.prevRankings = rankings;
    if (rankings.derive) {
      data.deriveDefault(rankings.supportTypes);
    }
    if (rankings.restore) {
      data.restore(rankings.restore);
    }
    rankings.builders.forEach((b) => LineUpRanking.build(b, data!));
  }

  private buildProvider() {
    console.log('build provider');
    const columns = this.buildColumns(this.props.data, this.resolveColumnDescs(this.props.data));
    const data = new LocalDataProvider(this.props.data, columns, pick(this.props, providerOptions));

    this.buildRankings(data, this.resolveRankings());

    data.setSelection(this.props.selection || []);
    data.on(LocalDataProvider.EVENT_SELECTION_CHANGED, this.onSelectionChanged);

    return data;
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
    console.log('build lineup instance');
    this.instance = this.createInstance(this.node, this.data!, changedLineUpOptions);
  }

  private updateProvider(prevProps: Readonly<ILineUpProps>) {
    const changedProviderOptions = isSame(this.props, prevProps, providerOptions);
    if (changedProviderOptions || !this.data || !equal(this.props.data, prevProps.data)) {
      // big change start from scratch
      this.data = this.buildProvider();
      return;
    }

    const rankings = this.resolveRankings();
    const columns = this.resolveColumnDescs(this.props.data);
    const columnsChanged = !equal(this.prevColumns, columns);
    if (columnsChanged) {
      const descs = this.buildColumns(this.props.data, columns);
      this.data.clearColumns();
      descs.forEach((d) => this.data!.pushDesc(d));
    }

    if(columnsChanged || !equal(rankings, this.prevRankings)) {
      this.buildRankings(this.data, rankings);
    }

    this.data.on(LocalDataProvider.EVENT_SELECTION_CHANGED, null);
    this.data.setSelection(this.props.selection || []);
    this.data.on(LocalDataProvider.EVENT_SELECTION_CHANGED, this.onSelectionChanged);
  }

  componentDidUpdate(prevProps: Readonly<ILineUpProps>) {
    this.updateProvider(prevProps);
    this.updateLineUp(prevProps);

    this.instance!.update();
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
