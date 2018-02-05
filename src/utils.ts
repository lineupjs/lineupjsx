import * as React from 'react';
import * as equal from 'fast-deep-equal';


export function isTypeInstance(clazz: any, superClass: any) {
  let c = clazz;
  while (c && c !== superClass) {
    c = c.__proto__;
  }
  return c === superClass;
}

export function filterChildren<T>(children: React.ReactNode, clazz: any): T[] {
  return React.Children.toArray(children).filter((d: any) => typeof d !== 'string' && isTypeInstance(d.type, clazz)).map((d: any) => {
    return <T>(new d.type(d.props, null));
  });
}

export function pick<T>(obj: T, keys: (keyof T)[]): Pick<T, keyof T> {
  const r: Pick<T, keyof T> = <any>{};
  keys.forEach((k) => r[k] = obj[k]);
  return r;
}

export function isSame<T>(current: T, prev: T, props: (keyof T)[]) {
  if(props.every((p) => equal(current[p], prev[p]))) {
    return null;
  }
  return pick(current, props);
}
