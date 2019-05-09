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
                defaultMessage="Simple Token"
                description="Name of extension"
                id="gui.extension.tokenSimple.name"
            />
        ),
        extensionId: 'tokenSimple',
        collaborator: 'Nick Addison',
        // iconURL: boostIconURL,
        // insetIconURL: boostInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Just an ERC20 token"
                description="Description of extension"
                id="gui.extension.tokenSimple.description"
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
                defaultMessage="Music"
                description="Name for the 'Music' extension"
                id="gui.extension.music.name"
            />
        ),
        extensionId: 'music',
        iconURL: musicIconURL,
        insetIconURL: musicInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Play instruments and drums."
                description="Description for the 'Music' extension"
                id="gui.extension.music.description"
            />
        ),
        featured: false
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Pen"
                description="Name for the 'Pen' extension"
                id="gui.extension.pen.name"
            />
        ),
        extensionId: 'pen',
        iconURL: penIconURL,
        insetIconURL: penInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Draw with your sprites."
                description="Description for the 'Pen' extension"
                id="gui.extension.pen.description"
            />
        ),
        featured: false
    },
];
