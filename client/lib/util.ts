// this is adapted from
// https://github.com/0xPARC/cabal/blob/main/snap/src/snark_utils/generate_proof.js
// https://github.com/doubleblind-xyz/double-blind/blob/master/src/pages/SetupPage.tsx


const snarkjs = require("snarkjs");
import localforage from "localforage";

const loadURL = "https://d27ahxc61uj811.cloudfront.net/";

async function downloadFromFilename(filename: string) {
  const link = loadURL + filename;
  try {
    const zkeyResp = await fetch(link, {
      method: 'GET'
    });
    const zkeyBuff = await zkeyResp.arrayBuffer();
    await localforage.setItem(
      filename,
      zkeyBuff
    );
    console.log(
      `Storage of ${filename} successful!`
    );
  } catch (e) {
    console.log(
      `Storage of ${filename} unsuccessful, make sure IndexedDB is enabled in your browser.`
    );
  }
}

export const downloadProofFiles = async function (filename: string) {
  const zkeySuffix = ['b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'];
  const filePromises = [];
  for (const c of zkeySuffix) {
    const item = await localforage.getItem(`${filename}.zkey${c}`);
    if (item) {
      console.log(`${filename}.zkey${c} already exists!`);
      continue;
    }
    filePromises.push(downloadFromFilename(`${filename}.zkey${c}`));
  }
  await Promise.all(filePromises);
}

export const generateProof = async function (filename: string) {
  const input = await fetch(`./input_${filename}.json`).then(function(res) {
    return res.json();
  });

  const { proof, publicSignals } =
    await snarkjs.groth16.fullProve(
      input,
      `./${filename}.wasm`,
      `${filename}.zkey`
    );
  
  return {
    proof: proof,
    publicSignals: publicSignals,
  };
}

export const verifyProof = async function(proof: string, publicSignals: string[], filename: string) {
  const vkey = await fetch(`./vkey_${filename}.json`).then(function(res) {
    return res.json();
  });
  const res = await snarkjs.groth16.verify(vkey, publicSignals, proof);

  return {
      verification: res,
  };
}