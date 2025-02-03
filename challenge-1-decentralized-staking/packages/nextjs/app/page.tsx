"use client";

import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  // Contoh event staking yang akan di-loop (Dummy Data)
  const stakingEvents = [
    {
      args: {
        staker: "0x1234567890abcdef1234567890abcdef12345678",
        amount: BigInt(1000000000000000000), // 1 ETH dalam wei
      },
    },
    {
      args: {
        staker: "0x9e9f8e4c72a3a9b7c0dbb5f00775f957fdb60dbf",
        amount: BigInt(2500000000000000000), // 2.5 ETH dalam wei
      },
    },
  ];

  return (
    <>
      <div className="flex flex-col items-center flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Scaffold-ETH 2</span>
            <span className="block text-xl font-bold">(SpeedRunEthereum Challenge #1 extension)</span>
          </h1>
          <div className="flex flex-col sm:flex-row justify-center items-center space-x-2">
            <p className="my-2 font-medium">Connected Address:</p>
            {connectedAddress ? <Address address={connectedAddress} /> : <p className="text-gray-500">Not connected</p>}
          </div>

          <div className="flex flex-col items-center flex-grow pt-10">
            <div className="px-5">
              <h1 className="text-center mb-6">
                <span className="block text-2xl mb-2">SpeedRunEthereum</span>
                <span className="block text-4xl font-bold">Challenge #1: 🔏 Decentralized Staking App</span>
              </h1>
              <div className="flex flex-col items-center justify-center">
                <Image
                  src="/hero.png"
                  width={727}
                  height={231}
                  alt="challenge banner"
                  className="rounded-xl border-4 border-primary"
                />
                <div className="max-w-3xl">
                  <p className="text-center text-lg mt-8">
                    🦸 A superpower of Ethereum is allowing you, the builder, to create a simple set of rules that an
                    adversarial group of players can use to work together. In this challenge, you create a decentralized
                    application where users can coordinate a group funding effort. If the users cooperate, the money is
                    collected in a second smart contract. If they defect, the worst that can happen is everyone gets
                    their money back. The users only have to trust the code.
                  </p>
                  <p className="text-center text-lg">
                    🌟 The final deliverable is deploying a Dapp that lets users send ether to a contract and stake if
                    the conditions are met, then deploy your app to a public webserver. Submit the URL on{" "}
                    <a href="https://speedrunethereum.com/" target="_blank" rel="noreferrer" className="underline">
                      SpeedRunEthereum.com
                    </a>{" "}
                    !
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Staking Events Section */}
        <div className="flex flex-col items-center mt-12">
          <h2 className="text-2xl font-bold mb-4">Staking Events</h2>
          <table className="table-auto border-collapse border border-gray-500 w-full max-w-2xl">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-500 px-4 py-2">Staker</th>
                <th className="border border-gray-500 px-4 py-2">Amount (ETH)</th>
              </tr>
            </thead>
            <tbody>
              {stakingEvents.map((event, index) => (
                <tr key={index} className="bg-white border-b border-gray-300">
                  <td className="border border-gray-500 px-4 py-2">
                    <Address address={event.args?.staker} />
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {formatEther(event.args?.amount || BigInt(0))} ETH
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-12">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
