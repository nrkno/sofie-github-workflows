# Sofie Tag Pruner

Use this action to clean up tags in GitHub repositories.

## Usage

```yaml
uses: nrkno/sofie-github-workflows/.github/actions/tag-pruner@v1
with:
  # Tags older than the specified number of days will be deleted (required)
  older-than: 30
  
  # Regex pattern for tags that should be ignored
  ignore: v[0-9]+\.[0-9]+\.[0-9]+.*
  
  # Run in simulation mode which will list the tags to be deleted without deleting them
  simulation: false
  
```

## Development

> Requires Node 16 or later.

Install the dependencies.
```bash
$ yarn
```

Make your changes.

Build the typescript and package it for distribution.
```bash
$ yarn build && yarn package
```

Create a new version tag (E.G. ````v2````) or update an existing one as required.

Push the changes to GitHub.
