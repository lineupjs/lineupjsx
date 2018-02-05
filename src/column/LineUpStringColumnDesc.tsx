import {IStringColumnDesc} from 'lineupjs';
import LineUpColumnDesc, {ILineUpColumnDescProps} from './LineUpColumnDesc';

export interface ILineUpStringColumnDescProps extends ILineUpColumnDescProps {
  editable?: boolean;
  html?: boolean;
  pattern?: string;
  patternTemplates?: string[];
}

export default class LineUpStringColumnDesc extends LineUpColumnDesc<ILineUpStringColumnDescProps> {
  static build(props: ILineUpStringColumnDescProps): IStringColumnDesc {
    const desc: any = LineUpColumnDesc.build({...props, type: 'string'});

    (['pattern', 'patternTemplate'] as (keyof ILineUpStringColumnDescProps)[]).forEach((key) => {
      if (props.hasOwnProperty(key)) {
        desc[key] = props[key];
      }
    });
    if (props.editable) {
      desc.type = 'annotate';
    }
    if (props.html) {
      desc.escape = false;
    }
    return desc;
  }
}
