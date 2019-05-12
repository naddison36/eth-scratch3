import React from 'react';
import {FormattedMessage} from 'react-intl';

export default [
    {
        name: (
          <FormattedMessage
            defaultMessage="Ether"
            description="Name of extension"
            id="gui.extension.ether.name"
          />
        ),
        extensionId: 'ether',
        collaborator: 'Nick Addison',
        // iconURL: boostIconURL,
        // insetIconURL: boostInsetIconURL,
        description: (
          <FormattedMessage
            defaultMessage="Ether blocks"
            description="Description of extension"
            id="gui.extension.ether.description"
          />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: false,
        internetConnectionRequired: true
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Basic Token"
                description="Name of extension"
                id="gui.extension.tokenBasic.name"
            />
        ),
        extensionId: 'tokenBasic',
        collaborator: 'Nick Addison',
        // iconURL: boostIconURL,
        // insetIconURL: boostInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="A basic ERC20 token"
                description="Description of extension"
                id="gui.extension.tokenBasic.description"
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: false,
        internetConnectionRequired: true
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Full Token"
                description="Name of extension"
                id="gui.extension.tokenDetailedMintableBurnable.name"
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
                id="gui.extension.tokenDetailedMintableBurnable.description"
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: false,
        internetConnectionRequired: true
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Basic NFT"
                description="Name of extension"
                id="gui.extension.tokenNFTBasic.name"
            />
        ),
        extensionId: 'tokenNFTBasic',
        collaborator: 'Nick Addison',
        // iconURL: boostIconURL,
        // insetIconURL: boostInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="A basic ERC721 non-fungible token"
                description="Description of extension"
                id="gui.extension.tokenNFTBasic.description"
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: false,
        internetConnectionRequired: true
    },
];
