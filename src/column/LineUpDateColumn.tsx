import {IDateColumnDesc} from 'lineupjs';
import LineUpColumn, {ILineUpColumnProps} from './LineUpColumn';

export interface ILineUpDateColumnProps extends ILineUpColumnProps {
  dateFormat?: string;
  dateParse?: string;
}

export default class LineUpDateColumn extends LineUpColumn<IDateColumnDesc, ILineUpDateColumnProps> {
  protected get type() {
    return 'date';
  }

  build(data: any[]) {
    const desc: any = super.build(data);

    (['dateFormat', 'dateParse'] as (keyof ILineUpDateColumnProps)[]).forEach((key) => {
      if (this.props.hasOwnProperty(key)) {
        desc[key] = this.props[key];
      }
    });
    return desc;
  }
}
