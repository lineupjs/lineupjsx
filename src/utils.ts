import * as React from 'react';


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
