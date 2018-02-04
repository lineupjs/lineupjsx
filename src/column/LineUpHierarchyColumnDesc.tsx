import {IHierarchyColumnDesc, IPartialCategoryNode} from 'lineupjs';
import LineUpColumnDesc, {ILineUpColumnDescProps} from './LineUpColumnDesc';

export interface ILineUpHierarchyColumnDescProps extends ILineUpColumnDescProps {
  hierarchy: IPartialCategoryNode;
  hierarchySeparator?: string;
}

export default class LineUpHierarchyColumnDesc extends LineUpColumnDesc<IHierarchyColumnDesc, ILineUpHierarchyColumnDescProps> {
  protected get type() {
    return 'hierarchy';
  }

  build(data: any[]) {
    const desc: any = super.build(data);

    (['hierarchy', 'hierarchySeparator'] as (keyof ILineUpHierarchyColumnDescProps)[]).forEach((key) => {
      if (this.props.hasOwnProperty(key)) {
        desc[key] = this.props[key];
      }
    });
    return desc;
  }
}
