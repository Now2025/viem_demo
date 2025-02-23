"use client";

import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { useState, useEffect } from "react";


const client = createPublicClient({
  chain: mainnet,
  transport: http("https://eth-mainnet.public.blastapi.io"),
});

const NFT_CONTRACT_ADDRESS = "0x0483b0dfc6c78062b9e999a82ffb795925381415";
const NFT_TOKEN_ID = 1;

async function getOwner(nftContractAddress: string, nftTokenId: number) {
  const owner = await client.readContract({
    address: nftContractAddress as `0x${string}`,
    abi: [
      {
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "ownerOf",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "ownerOf",
    args: [BigInt(nftTokenId)],
  });
  return owner;
}

async function getTokenURI(nftContractAddress: string, nftTokenId: number) {
  const tokenURI = await client.readContract({
    address: nftContractAddress as `0x${string}`,
    abi: [
      {
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "tokenURI",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "tokenURI",
    args: [BigInt(nftTokenId)],
  });
  return tokenURI;
}

export default function Page() {
  const [owner, setOwner] = useState<string | null>(null);
  const [tokenURI, setTokenURI] = useState<string | null>(null);
  const [nftAddress, setNftAddress] = useState<string>(NFT_CONTRACT_ADDRESS);
  const [tokenId, setTokenId] = useState<number>(NFT_TOKEN_ID);

  useEffect(() => {
    async function fetchData() {
      const ownerData = await getOwner(nftAddress, tokenId);
      const tokenURIData = await getTokenURI(nftAddress, tokenId);

      setOwner(ownerData);
      setTokenURI(tokenURIData);
    }

    fetchData();
  }, [nftAddress, tokenId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-extrabold text-center text-gray-900">
          查询 NFT 信息
        </h2>
        
        <form className="space-y-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="contract-address" className="text-sm font-medium text-gray-700">
              NFT 合约地址
            </label>
            <input
              id="contract-address"
              name="contract-address"
              type="text"
              value={nftAddress}
              onChange={(e) => setNftAddress(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="token-id" className="text-sm font-medium text-gray-700">
              Token ID
            </label>
            <input
              id="token-id"
              name="token-id"
              type="number"
              value={tokenId}
              onChange={(e) => setTokenId(Number(e.target.value))}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </form>

        <div className="space-y-4 mt-8">
          <div className="text-center text-sm font-medium text-gray-700">
            <p>
              <span className="font-bold">持有人地址:</span>{" "}
              {owner ? (
                <span className="text-indigo-600">{owner}</span>
              ) : (
                <span className="text-gray-500">正在加载...</span>
              )}
            </p>
          </div>

          <div className="text-center text-sm font-medium text-gray-700">
            <p>
              <span className="font-bold">NFT 元数据 URI:</span>{" "}
              {tokenURI ? (
                <a
                  href={tokenURI}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  {tokenURI}
                </a>
              ) : (
                <span className="text-gray-500">正在加载...</span>
              )}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            刷新信息
          </button>
        </div>
      </div>
    </div>
  );
}
