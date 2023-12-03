# svg-to-tsx

Convert all your SVGs to a single TSX module

## Usage

1. Run `npm i svg-to-tsx`
2. Add following script to your `package.json`

```json
"icons": "svg-to-tsx -i ./input/path -o ./output/path -n fileName"
```

3. Run `npm run icons`

## CLI Options

| Short | Long     | Description                         | Default |
| ----- | -------- | ----------------------------------- | ------- |
| -i    | --input  | Path to where SVG files are located | none    |
| -o    | --output | Output module destination path      | none    |
| -n    | --name   | Output module file name             | "icons" |

## Warning

This package was made in a hurry because I needed it for my website. I will improve it somewhere in the future with additional settings.
