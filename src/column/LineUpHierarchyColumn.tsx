import {IHierarchyColumnDesc, IPartialCategoryNode} from 'lineupjs';
import LineUpColumn, {ILineUpColumnProps} from './LineUpColumn';

export interface ILineUpHierarchyColumnProps extends ILineUpColumnProps {
  hierarchy: IPartialCategoryNode;
  hierarchySeparator?: string;
}

export default class LineUpHierarchyColumn extends LineUpColumn<IHierarchyColumnDesc, ILineUpHierarchyColumnProps> {
  protected get type() {
    return 'hierarchy';
  }

  build(data: any[]) {
    const desc: any = super.build(data);

    (['hierarchy', 'hierarchySeparator'] as (keyof ILineUpHierarchyColumnProps)[]).forEach((key) => {
      if (this.props.hasOwnProperty(key)) {
        desc[key] = this.props[key];
      }
    });
    return desc;
  }
}
