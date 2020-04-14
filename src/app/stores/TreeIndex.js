export default class TreeIndex {
  static _indexes = new Map();
  static get() {
    return TreeIndex._indexes;
  }
}
