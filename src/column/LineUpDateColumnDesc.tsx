import {IDateColumnDesc} from 'lineupjs';
import LineUpColumnDesc, {ILineUpColumnDescProps} from './LineUpColumnDesc';

export interface ILineUpDateColumnDescProps extends ILineUpColumnDescProps {
  dateFormat?: string;
  dateParse?: string;
}

export default class LineUpDateColumnDesc extends LineUpColumnDesc<ILineUpDateColumnDescProps> {
  static build(props: ILineUpDateColumnDescProps): IDateColumnDesc {
    const desc: any = LineUpColumnDesc.build({...props, type: 'date'});

    (['dateFormat', 'dateParse'] as (keyof ILineUpDateColumnDescProps)[]).forEach((key) => {
      if (props.hasOwnProperty(key)) {
        desc[key] = props[key];
      }
    });
    return desc;
  }
}
