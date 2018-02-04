import {IDateColumnDesc} from 'lineupjs';
import LineUpColumnDesc, {ILineUpColumnDescProps} from './LineUpColumnDesc';

export interface ILineUpDateColumnDescProps extends ILineUpColumnDescProps {
  dateFormat?: string;
  dateParse?: string;
}

export default class LineUpDateColumnDesc extends LineUpColumnDesc<IDateColumnDesc, ILineUpDateColumnDescProps> {
  protected get type() {
    return 'date';
  }

  build(data: any[]) {
    const desc: any = super.build(data);

    (['dateFormat', 'dateParse'] as (keyof ILineUpDateColumnDescProps)[]).forEach((key) => {
      if (this.props.hasOwnProperty(key)) {
        desc[key] = this.props[key];
      }
    });
    return desc;
  }
}
