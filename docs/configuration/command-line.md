## Command-Line

Usage: basedpyright [options] [files...] [^1]

basedpyright can be run as either a language server or as a command-line tool. The command-line version allows for the following options:

| Flag                                    | Description                                          |
| :-------------------------------------- | :--------------------------------------------------- |
| --createstub `<IMPORT>`                 | Create type stub file(s) for import                  |
| --dependencies                          | Emit import dependency information                   |
| -h, --help                              | Show help message                                    |
| --ignoreexternal                        | Ignore external imports for --verifytypes            |
| --level <LEVEL>                         | Minimum diagnostic level (error or warning)          |
| --outputjson                            | Output results in JSON format                        |
| --gitlabcodequality                     | Output results to a gitlab code quality report       |
| --writebaseline                         | Write new errors to the baseline file                |
| --baselinefile `<FILE>`                 | Path to the baseline file to be used [^2]            |
| -p, --project `<FILE OR DIRECTORY>`     | Use the configuration file at this location          |
| --pythonpath `<FILE>`                   | Path to the Python interpreter [^3]                  |
| --pythonplatform `<PLATFORM>`           | Analyze for platform (Darwin, Linux, Windows)        |
| --pythonversion `<VERSION>`             | Analyze for version (3.3, 3.4, etc.)                 |
| --skipunannotated                       | Skip type analysis of unannotated functions          |
| --stats                                 | Print detailed performance stats                     |
| -t, --typeshedpath `<DIRECTORY>`        | Use typeshed type stubs at this location [^4]        |
| --threads <optional N>                  | Use up to N threads to parallelize type checking [^5]|
| -v, --venvpath `<DIRECTORY>`            | Directory that contains virtual environments [^6]    |
| --verbose                               | Emit verbose diagnostics                             |
| --verifytypes `<IMPORT>`                | Verify completeness of types in py.typed package     |
| --version                               | Print pyright version and exit                       |
| --warnings                              | Use exit code of 1 if warnings are reported [^7]     |
| -w, --watch                             | Continue to run and watch for changes [^8]           |
| -                                       | Read file or directory list from stdin               |

[^1]: If specific files are specified on the command line, it overrides the files or directories specified in the pyrightconfig.json or pyproject.toml file.

[^2]: Defaults to `./.basedpyright/baseline.json`

[^3]: This option is the same as the language server setting `python.pythonPath`. It cannot be used with `--venvpath`. The `--pythonpath` option is recommended over `--venvpath` in most cases. For more details, refer to the [import resolution](../usage/import-resolution.md#configuring-your-python-environment) documentation.

[^4]: Pyright has built-in typeshed type stubs for Python stdlib functionality. To use a different version of typeshed type stubs, specify the directory with this option.

[^5]: This feature is experimental. If thread count is > 1, multiple copies of pyright are executed in parallel to type check files in a project. If no thread count is specified, the thread count is based on the number of available logical processors (if at least 4) or 1 (if less than 4).

[^6]: `--venvpath` is discouraged in basedpyright. [see here](../benefits-over-pyright/better-defaults.md#default-value-for-pythonpath) for more info.

    This option is the same as the language server setting `python.venvPath`. It used in conjunction with configuration file, which can refer to different virtual environments by name. For more details, refer to the [configuration](./config-files.md) and [import resolution](../usage/import-resolution.md#configuring-your-python-environment) documentation. This allows a common config file to be checked in to the project and shared by everyone on the development team without making assumptions about the local paths to the venv directory on each developer’s computer.

[^7]: `--warnings` is equivalent to [`failOnWarnings`](./config-files.md#failOnWarnings), which is enabled by default in basedpyright, meaning this option is redundant unless you explicitly disable `failOnWarnings`. [see here](../benefits-over-pyright/better-defaults.md#typecheckingmode) for more information about this decision

[^8]: When running in watch mode, pyright will reanalyze only those files that have been modified. These “deltas” are typically much faster than the initial analysis, which needs to analyze all files in the source tree.


## Pyright Exit Codes

| Exit Code   | Meaning                                                           |
| :---------- | :---------------------------------------------------------------  |
| 0           | No errors reported                                                |
| 1           | One or more errors reported                                       |
| 2           | Fatal error occurred with no errors or warnings reported          |
| 3           | Config file could not be read or parsed                           |
| 4           | Illegal command-line parameters specified                         |


## JSON Output

If the “--outputjson” option is specified on the command line, diagnostics are output in JSON format. The JSON structure is as follows:
```ts
interface PyrightJsonResults {
    version: string,
    time: string,
    generalDiagnostics: Diagnostic[],
    summary: {
        filesAnalyzed: number,
        errorCount: number,
        warningCount: number,
        informationCount: number,
        timeInSec: number
    }
}
```

Each Diagnostic is output in the following format:

```ts
interface Diagnostic {
    file: string,
    cell?: string // if the file is a jupyter notebook
    severity: 'error' | 'warning' | 'information',
    message: string,
    rule?: string,
    range: {
        start: {
            line: number,
            character: number
        },
        end: {
            line: number,
            character: number
        }
    }
}
```

Diagnostic line and character numbers are zero-based.

Not all diagnostics have an associated diagnostic rule. Diagnostic rules are used only for diagnostics that can be disabled or enabled. If a rule is associated with the diagnostic, it is included in the output. If it’s not, the rule field is omitted from the JSON output.

## Gitlab code quality report

the `--gitlabcodequality` argument will output a [gitlab code quality report](https://docs.gitlab.com/ee/ci/testing/code_quality.html).

to enable this in your gitlab CI, you need to specify a path to the code quality report file to this argument, and in the `artifacts` section in your gitlab CI file:

```yaml
basedpyright:
  script: basedpyright --gitlabcodequality report.json
  artifacts:
    reports:
      codequality: report.json
```

## Regenerating the baseline file

if you're using [baseline](../benefits-over-pyright/baseline.md), as baselined errors are removed from your code, the CLI will automatically update the baseline file to remove them:

```
>basedpyright
updated ./.basedpyright/baseline.json with 200 errors (went down by 5)
0 errors, 0 warnings, 0 notes
```

the `--writebaseline` argument is only required if you are intentionally writing new errors to the baseline file. for more information about when to use this argument, [see here](../benefits-over-pyright/baseline.md#how-often-do-i-need-to-update-the-baseline-file).