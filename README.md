# Scratch

## Quick Start

The easiest way to play with the Scratch 3 extensions for Ethereum contracts is to run the Scratch server locally on a [Docker](https://www.docker.com/) container.
```bash
mkdir scratch
cd scratch
git clone https://github.com/naddison36/eth-scratch3.git
cd eth-scratch3
npm install
docker build -t eth-scratch3 --target web .
docker run -p 8601:8601 -e PORT=8601 eth-scratch3
```

After the server starts, Scratch should be available at [http://localhost:8601](http://localhost:8601)

To load an extension, click the `Add Extension` button on the bottom left of the Scratch UI.

## Scratch 3.0 Extension Development

### Prerequisite 

The following software must be installed before running the installation steps
- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/download/)
- [Docker](https://docs.docker.com/docker-for-mac/install/)

### Installation

The following will install this [Eth Scratch 3](https://github.com/naddison36/eth-scratch3) repository and the Scratch repositories [scratch-gui](https://github.com/LLK/scratch-gui) and [scratch-vm](https://github.com/LLK/scratch-vm). This will allow Scratch with the custom extensions to be run locally.
```bash
mkdir scratch
cd scratch
git clone https://github.com/naddison36/eth-scratch3.git
cd eth-scratch3
npm install

# install the scratch gui and vm packages
cd ../..
git clone https://github.com/LLK/scratch-gui.git
cd scratch-gui
npm install
cd ..
git clone https://github.com/LLK/scratch-vm.git
cd scratch-vm
npm install
npm install web3@1.0.0-beta.34
npm link
cd ../scratch-gui
npm link scratch-vm

# link crypto beasts to the scratch vm extensions
cd ../scratch-vm/src/extensions
ln -s ../../../eth-scratch3/scratch/extensions ./custom
# Link the extension to Truffle's deployed contract information
cd ../../../eth-scratch3/scratch/extensions/
ln -s ../../build/contracts contracts

# Copy modified scratch vm and gui files into the dependent packages
cd ../
cp gui/index.jsx ../../scratch-gui/src/lib/libraries/extensions/index.jsx
cp vm/extension-manager.js ../../scratch-vm/src/extension-support/extension-manager.js
cp gui/webpack.config.js ../../scratch-gui/webpack.config.js

# start the Scratch React App
cd ../../scratch-gui
npm start
```

After the server starts, Scratch should be available at [http://localhost:8601](http://localhost:8601) 

### Customization

The following steps are done in the above but a listed here for anyone who wants to write their own Scratch extension.

New extensions are registered in the scratch-gui project in the `src/lib/libraries/extensions/index.jsx` file. Add this to the `extensions` array
```js
{
    name: (
        <FormattedMessage
            defaultMessage="Detailed, mintable, burnable token"
            description="Name of extension"
            id="gui.extension.erc20.name"
        />
    ),
    extensionId: 'tokenDetailedMintableBurnable',
    collaborator: 'Nick Addison',
    // iconURL: boostIconURL,
    // insetIconURL: boostInsetIconURL,
    description: (
        <FormattedMessage
            defaultMessage="A detailed ERC20 token that is mintable and burnable"
            description="Description of extension"
            id="gui.extension.erc20.description"
        />
    ),
    featured: true,
    disabled: false,
    bluetoothRequired: false,
    internetConnectionRequired: true
},
```

The JavaScript in the extension file needs to be loaded via the `src/extension-support/extension-manager.js` file in the `scratch-vm` package. Add the following function property to the `builtinExtensions` object in the `src/extension-support/extension-manager.js` file
```js
tokenDetailedMintableBurnable: () => require('../extensions/custom/tokenDetailedMintableBurnable'),
```

## Useful Scratch 3.0 links
* [How to Develop Your Own Block for Scratch 3.0](https://medium.com/@hiroyuki.osaki/how-to-develop-your-own-block-for-scratch-3-0-1b5892026421) matches what has been done for this project.
* The [Scratch 3.0 Extensions Specification](https://github.com/LLK/scratch-vm/wiki/Scratch-3.0-Extensions-Specification) is now out of date and does not work.
* The unofficial Scratch 3 wiki is also now out of date. It covers how to install Scratch 3.0 on your local machine and develop an extension. See [Testing your Extensions](https://github.com/kyleplo/scratch-three-extension-docs/wiki/Testing-your-Extensions) and [Scratch GUI Getting Started](https://github.com/LLK/scratch-gui/wiki/Getting-Started) for more details.

# Ethereum

In order to deploy the contracts with the public test networks using [Truffle](https://truffleframework.com), the [config.js](./config.js) file needs to be updated with your private key and [Infura](https://infura.io) project id. See [Introducing the Infura Dashboard](https://blog.infura.io/introducing-the-infura-dashboard-8969b7ab94e7) for details on how to get an Infura project id.

To deploy the token contract to the Ropsten public test network.
```bash
truffle deploy --reset --network ropsten
```

# Testing

[Jest](https://jestjs.io/) tests are used to test the Scratch extensions.

`npm run test` will run the Jest tests. This runs from the test script in the package.json
```bash
./node_modules/.bin/jest --forceExit --detectOpenHandles --runInBand
```

To run a particular test, use the `-t` option. eg
```bash
./node_modules/.bin/jest --forceExit --detectOpenHandles --runInBand -t TokenDetailedMintableBurnable
```

If npx is installed globally, the tests can also be run by
```bash
npx jest --forceExit --detectOpenHandles --runInBand
```

# Docker

This [Dockerfile](./Dockerfile) will add the [ERC20](./scratch/extensions/erc20/index.js) as a built in extension, build the Scratch 3.0 react app and copy it into a nginx image. This can then be deployed to a cloud provider. This project is currently using Heroku, but others like AWS, Azure and GCP will also work.

`npm run buildWebImage` will build the Docker image which runs
```
docker build -t registry.heroku.com/eth-scratch3-prod/web:latest --target web .
```

`npm run bashWebImage` will shell into the build image which runs
```
docker run -it registry.heroku.com/eth-scratch3-prod/web:latest sh
```

`npm run runWebImage` will run the Scratch 3.0 react app locally
```
docker run -p 8601:8601 -e PORT=8601 registry.heroku.com/eth-scratch3-prod/web:latest
```

This project is deploying to Heroku hence the `registry.heroku.com/eth-scratch3-prod` image names. These will need to be changed if deploying to other cloud based Container Registries.

# Continuous Integration

[CicleCi](https://circleci.com/) is used for CI. The config file is [.circleci/config.yml](.circleci/config.yml).
