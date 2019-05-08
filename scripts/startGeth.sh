#!/bin/sh

# Used for testing
geth --datadir ../testchain --ipcdisable --rpc --rpcapi "eth,net,web3,debug" --rpccorsdomain '*' --rpcport 8646 --ws --wsport 8647 --wsaddr "localhost" --wsorigins="*" --port 32323 --mine --minerthreads 1 --etherbase 0 --maxpeers 0 --cache 1024 --targetgaslimit 8000000 --verbosity 3

