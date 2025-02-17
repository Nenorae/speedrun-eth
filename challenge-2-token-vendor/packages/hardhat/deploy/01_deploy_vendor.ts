import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";
import { ethers } from "hardhat";

const deployVendor: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Periksa saldo ETH deployer
  const balance = await hre.ethers.provider.getBalance(deployer);
  console.log(`Saldo deployer: ${ethers.formatEther(balance)} ETH`);

  // Ambil alamat kontrak YourToken yang sudah dideploy
  const yourTokenAddress = "0x241a2Bf12C30E616AdaE1340332d0aBc5932F6B0";

  // Verifikasi kontrak YourToken
  let yourToken: Contract;
  try {
    yourToken = await hre.ethers.getContractAt("YourToken", yourTokenAddress);
    // Verifikasi bahwa kontrak berfungsi dengan mengecek total supply
    const totalSupply = await yourToken.totalSupply();
    console.log(`Total supply YourToken: ${ethers.formatEther(totalSupply)} tokens`);
  } catch (error) {
    console.error("Gagal mengambil atau memverifikasi kontrak YourToken:", error);
    return;
  }

  // Dapatkan harga gas saat ini menggunakan getFeeData
  const feeData = await hre.ethers.provider.getFeeData();
  const currentGasPrice = feeData.gasPrice || feeData.maxFeePerGas;
  console.log(`Gas Price saat ini: ${ethers.formatUnits(currentGasPrice, "gwei")} gwei`);

  // Deploy kontrak Vendor dengan gas price yang sesuai
  const vendorDeployment = await deploy("Vendor", {
    from: deployer,
    args: [yourTokenAddress],
    log: true,
    waitConfirmations: 1,
    gasPrice: currentGasPrice,
    gasLimit: 2000000,
  });

  console.log(`✅ Vendor deployed at: ${vendorDeployment.address}`);

  // Verifikasi kontrak Vendor
  let vendor: Contract;
  try {
    vendor = await hre.ethers.getContractAt("Vendor", vendorDeployment.address);
    console.log("✅ Kontrak Vendor terverifikasi");
  } catch (error) {
    console.error("Gagal mengambil kontrak Vendor:", error);
    return;
  }

  // Transfer token ke kontrak Vendor
  try {
    const transferAmount = hre.ethers.parseEther("1000");
    console.log(`Mencoba transfer ${ethers.formatEther(transferAmount)} tokens ke Vendor...`);

    // Cek balance deployer terlebih dahulu
    const deployerBalance = await yourToken.balanceOf(deployer);
    console.log(`Balance deployer: ${ethers.formatEther(deployerBalance)} tokens`);

    if (deployerBalance < transferAmount) {
      console.log("Melakukan mint tambahan tokens ke deployer...");
      const mintTx = await yourToken.mint(deployer, transferAmount);
      await mintTx.wait();
    }

    const transferTx = await yourToken.transfer(vendor.address, transferAmount);
    await transferTx.wait();
    console.log("✅ Token berhasil ditransfer ke kontrak Vendor");

    // Verifikasi balance vendor
    const vendorBalance = await yourToken.balanceOf(vendor.address);
    console.log(`Balance Vendor: ${ethers.formatEther(vendorBalance)} tokens`);
  } catch (error) {
    console.error("Gagal transfer token ke kontrak Vendor:", error);
    return;
  }

  // Transfer kepemilikan kontrak Vendor
  const frontendAddress = "0xc619919e01B1A2B47530d79cEC60288c08be48A2";
  try {
    const transferOwnershipTx = await vendor.transferOwnership(frontendAddress);
    await transferOwnershipTx.wait();
    console.log(`✅ Kepemilikan Vendor ditransfer ke: ${frontendAddress}`);
  } catch (error) {
    console.error("Gagal transfer kepemilikan:", error);
  }
};

export default deployVendor;
deployVendor.tags = ["Vendor"];
