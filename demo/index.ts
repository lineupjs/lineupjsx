import 'file-loader?name=demo.html!./index.html';
import {ACellRenderer, ICellRenderContext, IColumn, PrefetchMixin, uniformContext} from '../src';
import '../src/style.scss';

/** @internal */
class Column<T> implements IColumn {
  constructor(public readonly index: number, public readonly name: string, public readonly frozen: boolean = false, public readonly width = 100) {

  }

  get id() {
    return `col${this.index}`;
  }

  common(document: Document) {
    const d = document.createElement('div');
    if (this.frozen) {
      d.classList.add('frozen');
    }
    d.dataset.id = this.id;
    return d;
  }

  header(document: Document) {
    const d = this.common(document);
    d.textContent = this.name;
    return d;
  }

  cell(row: T, document: Document) {
    return this.update(this.common(document), row);
  }

  update(node: HTMLElement, row: T) {
    node.textContent = `${this.name}@${row.toString()}`;
    return node;
  }
}

/** @internal */
export default class TestRenderer extends ACellRenderer<Column<number>> {
  protected readonly _context: ICellRenderContext<Column<number>>;

  constructor(root: HTMLElement, id: string, numberOfRows = 1000, numberOfColumns = 20) {
    super(root, `#${id}`, {mixins: [PrefetchMixin]});
    root.id = id;

    const defaultRowHeight = 20;

    const columns: Column<number>[] = [];
    for (let i = 0; i < numberOfColumns; ++i) {
      columns.push(new Column(i, i.toString(36), i % 4 === 0));
    }
    this._context = Object.assign({
      columns,
      column: uniformContext(columns.length, 100),
    }, uniformContext(numberOfRows, defaultRowHeight));

  }

  protected createHeader(document: Document, column: Column<number>) {
    return column.header(document);
  }

  protected updateHeader() {
    // nothing do to
  }

  protected createCell(document: Document, index: number, column: Column<number>) {
    return column.cell(index, document);
  }

  protected updateCell(node: HTMLElement, index: number, column: Column<number>) {
    return column.update(node, index);
  }

  run() {
    //wait till layouted
    setTimeout(super.init.bind(this), 100);
  }

  protected get context() {
    return this._context;
  }

  protected updateRow(node: HTMLElement, index: number) {
    //return abortAble(resolveIn(2000)).then(() => {
    super.updateRow(node, index);
    //});
  }
}
