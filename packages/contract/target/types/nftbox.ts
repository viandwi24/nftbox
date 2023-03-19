export type Nftbox = {
  "version": "0.1.0",
  "name": "nftbox",
  "instructions": [
    {
      "name": "ping",
      "accounts": [],
      "args": [
        {
          "name": "msg",
          "type": "string"
        }
      ]
    },
    {
      "name": "createBoxSet",
      "accounts": [
        {
          "name": "boxSet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "image",
          "type": "string"
        },
        {
          "name": "maxSupply",
          "type": "u64"
        }
      ]
    },
    {
      "name": "addCardToBoxSet",
      "accounts": [
        {
          "name": "card",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "boxSet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "masterEdition",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "index",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "boxSetAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "image",
            "type": "string"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "maxSupply",
            "type": "u64"
          },
          {
            "name": "supply",
            "type": "u64"
          },
          {
            "name": "boxCards",
            "type": "u64"
          },
          {
            "name": "state",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "boxSetCardAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "boxSet",
            "type": "publicKey"
          },
          {
            "name": "masterEdition",
            "type": "publicKey"
          },
          {
            "name": "metadata",
            "type": "publicKey"
          },
          {
            "name": "tokenAccount",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "AddCardToBoxSetError",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "TokenOwnerMustSameAsAuthority"
          },
          {
            "name": "TokenMintMustSameWithMasterEdition"
          },
          {
            "name": "TokenMustBeHaveAmount"
          },
          {
            "name": "InvalidMasterEditionAccountData"
          },
          {
            "name": "IndexMustBeSameWithBoxCardsCount"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "SupplyMustBeGreaterThanZero",
      "msg": "supply must be greater than 0"
    }
  ]
};

export const IDL: Nftbox = {
  "version": "0.1.0",
  "name": "nftbox",
  "instructions": [
    {
      "name": "ping",
      "accounts": [],
      "args": [
        {
          "name": "msg",
          "type": "string"
        }
      ]
    },
    {
      "name": "createBoxSet",
      "accounts": [
        {
          "name": "boxSet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "image",
          "type": "string"
        },
        {
          "name": "maxSupply",
          "type": "u64"
        }
      ]
    },
    {
      "name": "addCardToBoxSet",
      "accounts": [
        {
          "name": "card",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "boxSet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "masterEdition",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "index",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "boxSetAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "image",
            "type": "string"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "maxSupply",
            "type": "u64"
          },
          {
            "name": "supply",
            "type": "u64"
          },
          {
            "name": "boxCards",
            "type": "u64"
          },
          {
            "name": "state",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "boxSetCardAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "boxSet",
            "type": "publicKey"
          },
          {
            "name": "masterEdition",
            "type": "publicKey"
          },
          {
            "name": "metadata",
            "type": "publicKey"
          },
          {
            "name": "tokenAccount",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "AddCardToBoxSetError",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "TokenOwnerMustSameAsAuthority"
          },
          {
            "name": "TokenMintMustSameWithMasterEdition"
          },
          {
            "name": "TokenMustBeHaveAmount"
          },
          {
            "name": "InvalidMasterEditionAccountData"
          },
          {
            "name": "IndexMustBeSameWithBoxCardsCount"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "SupplyMustBeGreaterThanZero",
      "msg": "supply must be greater than 0"
    }
  ]
};
