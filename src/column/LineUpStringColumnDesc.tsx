import {IStringColumnDesc} from 'lineupjs';
import LineUpColumnDesc, {ILineUpColumnDescProps} from './LineUpColumnDesc';

export interface ILineUpStringColumnDescProps extends ILineUpColumnDescProps {
  editable?: boolean;
  html?: boolean;
  pattern?: string;
  patternTemplates?: string[];
}

export default class LineUpStringColumnDesc extends LineUpColumnDesc<IStringColumnDesc, ILineUpStringColumnDescProps> {
  protected get type() {
    return 'string';
  }

  build(data: any[]) {
    const desc: any = super.build(data);

    (['pattern', 'patternTemplate'] as (keyof ILineUpStringColumnDescProps)[]).forEach((key) => {
      if (this.props.hasOwnProperty(key)) {
        desc[key] = this.props[key];
      }
    });
    if (this.props.editable) {
      desc.type = 'annotate';
    }
    if (this.props.html) {
      desc.escape = false;
    }
    return desc;
  }
}
