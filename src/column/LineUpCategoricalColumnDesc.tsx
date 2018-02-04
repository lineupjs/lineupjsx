import {ICategoricalColumnDesc, ICategory} from 'lineupjs';
import LineUpColumnDesc, {ILineUpColumnDescProps} from './LineUpColumnDesc';

export interface ILineUpCategoricalColumnDescProps extends ILineUpColumnDescProps {
  asOrdinal?: boolean;
  categories?: (string | Partial<ICategory>)[];
  missingCategory?: (string | Partial<ICategory>);
  asSet?: boolean|string;
}

export default class LineUpCategoricalColumnDesc extends LineUpColumnDesc<ICategoricalColumnDesc, ILineUpCategoricalColumnDescProps> {
  protected get type() {
    return 'categorical';
  }

  build(data: any[]) {
    const desc = super.build(data);

    if (this.props.asOrdinal) {
      desc.type = 'ordinal';
    }
    if (this.props.missingCategory) {
      desc.missingCategory = this.props.missingCategory;
    }
    if (this.props.asSet) {
      if (typeof this.props.asSet === 'string') {
        (desc as any).separator = this.props.asSet;
      }
      desc.type = 'set';
    }


    if (!this.props.categories) {
      // derive categories
      const categories = new Set(data.map((d) => d[(desc as any).column] as string));
      desc.categories = Array.from(categories).sort();
    } else {
      desc.categories = this.props.categories;
    }
    return desc;
  }
}
