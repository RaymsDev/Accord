import { ISelectable } from './ISelectable';
export class Selectable<T> implements ISelectable<T> {
  public Item: T;
  public IsSelected: boolean;

  constructor(data?: Partial<ISelectable<T>>) {
    if (!data) {
      return;
    }

    this.Item = data.Item || null;
    this.IsSelected = data.IsSelected || false;
  }
}
