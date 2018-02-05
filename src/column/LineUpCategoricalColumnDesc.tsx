import {ICategoricalColumnDesc, ICategory} from 'lineupjs';
import LineUpColumnDesc, {ILineUpColumnDescProps} from './LineUpColumnDesc';

export interface ILineUpCategoricalColumnDescProps extends ILineUpColumnDescProps {
  asOrdinal?: boolean;
  categories?: (string | Partial<ICategory>)[];
  missingCategory?: (string | Partial<ICategory>);
  asSet?: boolean|string;
}

export default class LineUpCategoricalColumnDesc extends LineUpColumnDesc<ILineUpCategoricalColumnDescProps> {
  static build(props: ILineUpCategoricalColumnDescProps, data: any[]): ICategoricalColumnDesc {
    const desc: any = LineUpColumnDesc.build({...props, type: 'categorical'});

    if (props.asOrdinal) {
      desc.type = 'ordinal';
    }
    if (props.missingCategory) {
      desc.missingCategory = props.missingCategory;
    }
    if (props.asSet) {
      if (typeof props.asSet === 'string') {
        (desc as any).separator = props.asSet;
      }
      desc.type = 'set';
    }


    if (!props.categories) {
      // derive categories
      const categories = new Set(data.map((d) => d[(desc as any).column] as string));
      desc.categories = Array.from(categories).sort();
    } else {
      desc.categories = props.categories;
    }
    return desc;
  }
}
