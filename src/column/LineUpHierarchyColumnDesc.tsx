import {IHierarchyColumnDesc, IPartialCategoryNode} from 'lineupjs';
import LineUpColumnDesc, {ILineUpColumnDescProps} from './LineUpColumnDesc';

export interface ILineUpHierarchyColumnDescProps extends ILineUpColumnDescProps {
  hierarchy: IPartialCategoryNode;
  hierarchySeparator?: string;
}

export default class LineUpHierarchyColumnDesc extends LineUpColumnDesc<ILineUpHierarchyColumnDescProps> {
  static build(props: Partial<ILineUpHierarchyColumnDescProps>): IHierarchyColumnDesc {
    const desc: any = LineUpColumnDesc.build({...props as any, type: 'hierarchy'});

    (['hierarchy', 'hierarchySeparator'] as (keyof ILineUpHierarchyColumnDescProps)[]).forEach((key) => {
      if (props.hasOwnProperty(key)) {
        desc[key] = props[key];
      }
    });
    return desc;
  }
}
