#!/bin/sh

rm -f ../testchain/geth/chaindata/*

geth --datadir ../testchain init genesis.json
geth account new --keystore ../testchain/keystore
