import React from 'react';
import {FormattedMessage} from 'react-intl';

import musicIconURL from './music/music.png';
import musicInsetIconURL from './music/music-small.svg';

import penIconURL from './pen/pen.png';
import penInsetIconURL from './pen/pen-small.svg';

export default [
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
                defaultMessage="A basic non-fungible token"
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
