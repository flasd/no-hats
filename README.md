Dependecy hats are problematic because they can cause unexpected changes in your dependencies.

For example, if you have a dependency on "foo@^1.0.0" and "foo@1.1.0" is released, installing dependencies will install 1.1.0 instead of 1.0.0.

This can cause unexpected bugs and breakages in your code.

This package will help you avoid this problem by stopping commits that adds dependency hats.

### Installation

```sh
yarn @flasd/no-hats
```

### Usage

Add the following to your `package.json`:

```json
{
  "lint-staged": {
    "package.json": ["no-hats"]
  }
}
```
