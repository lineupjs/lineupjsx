import {extent} from 'd3-array';
import {EAdvancedSortMethod, INumberColumnDesc} from 'lineupjs';
import LineUpColumnDesc, {ILineUpColumnDescProps} from './LineUpColumnDesc';

export interface ILineUpNumberColumnDescProps extends ILineUpColumnDescProps {
  domain?: [number, number];
  range?: [number, number];
  mapping?: 'linear'|'sqrt'|'pow1.1'|'pow2'|'pow3';
  scripted?: string;
  sort?: EAdvancedSortMethod;
}

export default class LineUpNumberColumn extends LineUpColumnDesc<INumberColumnDesc, ILineUpNumberColumnDescProps> {
  protected get type() {
    return 'number';
  }

  build(data: any[]) {
    const desc: any = super.build(data);

    const domain = this.props.domain ? this.props.domain : extent(data, (d) => d[(desc as any).column] as number) as [number, number];

    (['sort'] as (keyof ILineUpNumberColumnDescProps)[]).forEach((key) => {
      if (this.props.hasOwnProperty(key)) {
        desc[key] = this.props[key];
      }
    });
    if (this.props.scripted) {
      desc.map = {domain, code: this.props.scripted, type: 'script'};
    } else if (!this.props.mapping || this.props.mapping === 'linear') {
      desc.domain = domain;
      if (this.props.range) {
        desc.range = this.props.range;
      }
    } else {
      desc.map = {
        type: this.props.mapping,
        domain,
        range: this.props.range || [0, 1]
      };
    }
    return desc;
  }
}
