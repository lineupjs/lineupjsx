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

export default class LineUpNumberColumn extends LineUpColumnDesc<ILineUpNumberColumnDescProps> {
  static build(props: ILineUpNumberColumnDescProps, data: any[]): INumberColumnDesc {
    const desc: any = LineUpColumnDesc.build({...props, type: 'number'});

    const domain = props.domain ? props.domain : extent(data, (d) => d[(desc as any).column] as number) as [number, number];

    (['sort'] as (keyof ILineUpNumberColumnDescProps)[]).forEach((key) => {
      if (props.hasOwnProperty(key)) {
        desc[key] = props[key];
      }
    });
    if (props.scripted) {
      desc.map = {domain, code: props.scripted, type: 'script'};
    } else if (!props.mapping || props.mapping === 'linear') {
      desc.domain = domain;
      if (props.range) {
        desc.range = props.range;
      }
    } else {
      desc.map = {
        type: props.mapping,
        domain,
        range: props.range || [0, 1]
      };
    }
    return desc;
  }
}
