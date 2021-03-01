# LineUp.js React Wrapper (LineUp.jsx)

[![License: MIT][mit-image]][mit-url] [![NPM version][npm-image]][npm-url] [![Github Actions][github-actions-image]][github-actions-url]

LineUp is an interactive technique designed to create, visualize and explore rankings of items based on a set of heterogeneous attributes.
This is a [React](https://reactjs.org/) wrapper around the JavaScript library [LineUp.js](https://github.com/lineupjs/lineupjs). Details about the LineUp visualization technique can be found at [http://lineup.caleydo.org](http://lineup.caleydo.org).

## Usage

**Installation**

```bash
npm install lineupjsx
```

```html
<link href="https://unpkg.com/lineupjsx/build/LineUpJSx.css" rel="stylesheet" />
<script src="https://unpkg.com/lineupjsx/build/LineUpJSx.js"></script>
```

**Minimal Usage Example**

```javascript
// generate some data
const arr = [];
const cats = ['c1', 'c2', 'c3'];
for (let i = 0; i < 100; ++i) {
  arr.push({
    a: Math.random() * 10,
    d: 'Row ' + i,
    cat: cats[Math.floor(Math.random() * 3)],
    cat2: cats[Math.floor(Math.random() * 3)],
  });
}
```

```jsx
<LineUp data={arr} />
```

[CodePen](https://codepen.io/sgratzl/pen/mXEpMP)

![Minimal Result](https://user-images.githubusercontent.com/4129778/34654173-32180ff8-f3f8-11e7-8469-229fa34a65dc.png)

**Advanced Usage Example**

```jsx
// arr from before
<LineUp data={arr} defaultRanking>
  <LineUpStringColumnDesc column="d" label="Label" width={100} />
  <LineUpCategoricalColumnDesc column="cat" categories={cats} color="green" />
  <LineUpCategoricalColumnDesc column="cat2" categories={cats} color="blue" />
  <LineUpNumberColumnDesc column="a" domain={[0, 10]} color="blue" />

  <LineUpRanking groupBy="cat" sortBy="a:desc">
    <LineUpSupportColumn type="*" />
    <LineUpColumn column="*" />
    <LineUpImposeColumn label="a+cat" column="a" categeoricalColumn="cat2" />
  </LineUpRanking>
</LineUp>
```

[CodePen](https://codepen.io/sgratzl/pen/yvJpWQ)

![Advanced Result](https://user-images.githubusercontent.com/4129778/34654174-3235f784-f3f8-11e7-9361-44f5fa068bb9.png)

## Supported Browsers

- Chrome 64+ (best performance)
- Firefox 57+
- Edge 16+

## Development Environment

**Installation**

```bash
git clone https://github.com/lineupjs/lineupjsx.git
cd lineupjsx
npm i -g yarn
yarn set version berry
yarn set version latest
cat .yarnrc_patch.yml >> .yarnrc.yml
yarn install
yarn pnpify --sdk vscode
```

### Common commands

```sh
yarn start
yarn clean
yarn compile
yarn test
yarn lint
yarn fix
yarn build
yarn docs
yarn release
yarn release:pre
```

## Authors

- Samuel Gratzl (@sgratzl)

[npm-image]: https://badge.fury.io/js/lineupjsx.svg
[npm-url]: https://npmjs.org/package/lineupjsx
[mit-image]: https://img.shields.io/badge/License-MIT-yellow.svg
[mit-url]: https://opensource.org/licenses/MIT
[github-actions-image]: https://github.com/lineupjs/lineupjsx/workflows/ci/badge.svg
[github-actions-url]: https://github.com/lineupjs/lineupjsx/actions
