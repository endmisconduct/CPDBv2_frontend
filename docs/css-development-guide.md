# CSS Development Guide

## Common guidelines

- Write styling for your component with Sass syntax and save it with extension `.scss`. Each component module should only import styles from it's own dedicated sass file. Thus each import path should always begin with `./`. For example:

```javascript
// components/component.js

...
import styles from './component.scss';

...
  render() {
    return <div className={ styles.myDiv }/>>
  }
```

- Class name in Sass files should be in camel case and begin with lower case character.

- CSS classes that are there for the sole purpose of testing must begin with `test--`.

- `.css` files can also be imported like `.sass` files but are not localized with CSS modules. They are global styles including those that are use by 3rd party libraries.

- Inline styles can be used when more programmatic approach is required.

- Sometime you will see something like: 
```css
height: 30px;
line-height: 29px;
```
This is to fulfill optical center, for more information please take a look at: https://services.math.duke.edu/education/ccp/resources/write/design/graphic7.html

## Naming css color variables

- Use web approx colors with postfix `-color` at the end, eg $black-10-color
- rgba color should be name with the color name and alpha: `[color-name]-[alpha]-color`, eg $thunder-90-color
- Find colors tool http://chir.ag/projects/name-that-color/
