import * as React from 'react';
import * as equal from 'fast-deep-equal';


export function isTypeInstance(clazz: any, superClass: any) {
  let c = clazz;
  while (c && c !== superClass) {
    c = c.__proto__;
  }
  return c === superClass;
}

export class ChildWrapper<T, P> {
  constructor(public readonly props: P, public readonly type: any) {

  }

  create() {
    return <T>(new this.type(this.props, null));
  }
}

export function filterChildrenProps<T, P>(children: React.ReactNode, clazz: any): ChildWrapper<T, P>[] {
  return React.Children.toArray(children).filter((d: any) => React.isValidElement(d) && isTypeInstance(d.type, clazz)).map((d: any) => {
    return new ChildWrapper<T, P>(d.props, d.type);
  });
}

export function filterChildren<T>(children: React.ReactNode, clazz: any): T[] {
  return filterChildrenProps<T, any>(children, clazz).map((d) => d.create());
}

export function pick<T>(obj: T, keys: (keyof T)[]): Pick<T, keyof T> {
  const r: Pick<T, keyof T> = <any>{};
  keys.forEach((k) => {
    if (obj.hasOwnProperty(k)) {
      r[k] = obj[k];
    }
  });
  return r;
}

export function isSame<T>(current: T, prev: T, props: (keyof T)[]) {
  if(props.every((p) => equal(current[p], prev[p]))) {
    return null;
  }
  return pick(current, props);
}
