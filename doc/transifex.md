# Transifex

Primero uses [transifex](https://www.transifex.com/) to translate over different languages.

## Installation
To install transifex cli you can run a single command:

```bash
curl -o- https://raw.githubusercontent.com/transifex/cli/master/install.sh | bash
```

This will find the version for your OS, download and add it to your profile. Then restart your terminal and
you can verify running:

```bash
tx --version
```

## Setting up client
Create a file `~/.transifexrc` and put the follow values
```text
[https://www.transifex.com]
api_hostname = https://api.transifex.com
hostname = https://www.transifex.com
password = <API-TOKEN/>
username = api
```
Where <API-TOKEN/> is generate [here](https://www.transifex.com/user/settings/api/)

## tx push
If you want to create or update a file you can use `tx push`.

### Resource
When the file to be pushed is a source file you need to set `-s` flag.

```bash
tx push -s primero-app-v2.enyml
```

### Translation
In case that you got translations files and you wants to push to transifex you need to specify the locale and that is a translation


```bash
tx push -t -l ar -r gbv-forms.transitionsyml
```

## tx pull
There is two translations **mode** that we can use it

### onlytranslated
This is the default mode that we use for translations, this is used in most of primero translations and there is no need to add any flag to the command

```bash
tx pull -f -l es
```
### onlyreviewed
There are some languages that are being reviewed after being translated, and every translations is marked as *reviewed* for those ones you should add the mode as a flag

```bash
tx pull -f -l ar --mode=onlyreviewed
```
