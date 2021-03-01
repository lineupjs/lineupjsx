import { builderAdapter } from 'lineupjs';
import * as React from 'react';

export class ChildWrapper<T, P> {
  constructor(public readonly props: P, public readonly type: any) {}

  create() {
    return new this.type(this.props, null) as T;
  }
}

export function filterChildrenProps<T, P = any>(children: React.ReactNode, clazz: any): ChildWrapper<T, P>[] {
  return React.Children.toArray(children)
    .filter((d: any) => React.isValidElement(d) && builderAdapter.isTypeInstance(d.type, clazz))
    .map((d: any) => {
      return new ChildWrapper<T, P>(d.props, d.type);
    });
}
