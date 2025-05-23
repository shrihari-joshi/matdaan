/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  DeployContractOptions,
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomicfoundation/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "ElectionManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ElectionManager__factory>;
    getContractFactory(
      name: "SimpleZKPVerifier",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SimpleZKPVerifier__factory>;
    getContractFactory(
      name: "VoteCounter",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.VoteCounter__factory>;
    getContractFactory(
      name: "Voting",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Voting__factory>;

    getContractAt(
      name: "Ownable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Ownable>;
    getContractAt(
      name: "ElectionManager",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ElectionManager>;
    getContractAt(
      name: "SimpleZKPVerifier",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.SimpleZKPVerifier>;
    getContractAt(
      name: "VoteCounter",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.VoteCounter>;
    getContractAt(
      name: "Voting",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Voting>;

    deployContract(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Ownable>;
    deployContract(
      name: "ElectionManager",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ElectionManager>;
    deployContract(
      name: "SimpleZKPVerifier",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.SimpleZKPVerifier>;
    deployContract(
      name: "VoteCounter",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.VoteCounter>;
    deployContract(
      name: "Voting",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Voting>;

    deployContract(
      name: "Ownable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Ownable>;
    deployContract(
      name: "ElectionManager",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ElectionManager>;
    deployContract(
      name: "SimpleZKPVerifier",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.SimpleZKPVerifier>;
    deployContract(
      name: "VoteCounter",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.VoteCounter>;
    deployContract(
      name: "Voting",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Voting>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
  }
}
