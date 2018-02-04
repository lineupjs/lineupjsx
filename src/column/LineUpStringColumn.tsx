import {IStringColumnDesc} from 'lineupjs';
import LineUpColumn, {ILineUpColumnProps} from './LineUpColumn';

export interface ILineUpStringColumnProps extends ILineUpColumnProps {
  editable?: boolean;
  html?: boolean;
  pattern?: string;
  patternTemplates?: string[];
}

export default class LineUpStringColumn extends LineUpColumn<IStringColumnDesc, ILineUpStringColumnProps> {
  protected get type() {
    return 'string';
  }

  build(data: any[]) {
    const desc: any = super.build(data);

    (['pattern', 'patternTemplate'] as (keyof ILineUpStringColumnProps)[]).forEach((key) => {
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
