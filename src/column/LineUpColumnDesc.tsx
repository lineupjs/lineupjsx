import {IArrayDesc, IColumnDesc} from 'lineupjs';
import * as React from 'react';

export interface ILineUpColumnDescProps {
  type?: string;
  column: string;
  label?: string;
  description?: string;
  frozen?: boolean;
  color?: string;
  width?: number;
  asMap?: boolean;
  asArray?: string[]|number|boolean;
  custom?: {[key: string]: any};

  renderer?: string;
  groupRenderer?: string;
  summaryRenderer?: string;
}

export default class LineUpColumnDesc<T extends IColumnDesc = IColumnDesc, P extends ILineUpColumnDescProps = ILineUpColumnDescProps> extends React.PureComponent<Readonly<P>, {}> {
  protected get type() {
    return this.props.type;
  }
  /**
   * build the column description
   */
  build(_data: any[]): T {
    const {column} = this.props;
    const desc = {column, type: this.type, label: column[0].toUpperCase() + column.slice(1)} as any;

    (['label', 'description', 'frozen', 'color', 'width', 'renderer', 'groupRenderer', 'summaryRenderer'] as (keyof ILineUpColumnDescProps)[]).forEach((key) => {
      if (this.props.hasOwnProperty(key)) {
        desc[key] = this.props[key];
      }
    });

    if (this.props.asMap) {
      console.assert(['categorical', 'date', 'number', 'string'].includes(desc.type!));
      desc.type += 'Map';
    }

    if (this.props.asArray != null) {
      console.assert(['boolean', 'categorical', 'date', 'number', 'string'].includes(this.desc.type!));
      desc.type += 's';
      const a = desc as IArrayDesc;
      const labels = this.props.asArray;
      if (Array.isArray(labels)) {
        a.labels = labels;
        a.dataLength = labels.length;
      } else if (typeof labels === 'number') {
        a.dataLength = labels;
      }
    }

    return desc as any;
  }
}
