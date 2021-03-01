import { LineUp } from './LineUp';
import { LocalDataProvider, ITaggleOptions, Taggle as TaggleImpl } from 'lineupjs';

export default class Taggle extends LineUp {
  protected createInstance(node: HTMLElement, data: LocalDataProvider, options: Partial<ITaggleOptions>) {
    return new TaggleImpl(node, data, options);
  }
}
