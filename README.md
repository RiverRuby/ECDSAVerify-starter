# ECDSAVerify-starter

Starter repo for web applications using ECDSAVerify. Need to use zkey chunks from https://github.com/nalinbhardwaj/snarkjs/commit/d1c10a6373c02eaa214968da96e2514ddc8c8b92 to allow efficient in-browser proving.

Initial version at https://ecdsa-verify-starter.vercel.app/. Will need to download a roughly 1G proving key, so if your download speed is slow this will take a while. And expect proof generation for ECDSAVerify to be ~4min.

## Directories

- `client` stores Next.js web application with code to download ECDSAVerify circuits from a S3 bucket + use to verify code
- `circuits` stores all the circom circuits that the web app uses
- `ecdsa-circuits` stores necessary circuits from https://github.com/0xPARC/circom-ecdsa
  - In a seperate directory instead of a git submodule as I ran into some issues with importing libraries
  - Will eventually refactor into submodule once that is fixed
- `scripts` has the snarkjs scripts to create all intermediate files for SNARK proving
  - Will likely need AWS machine with at least 32G RAM machine (AWS c5.4xlarge instance should work)
  - To run the "build\_\*\_chunks.sh" files, you'll need to clone https://github.com/nalinbhardwaj/snarkjs/commit/d1c10a6373c02eaa214968da96e2514ddc8c8b92 in the same directory as ../ECSDSAVerify-Starter
    - This will create chunked versions of the zkey that are necessary to run these proofs in browser
    - Will clean this setup in the future
- `test` has some code using circom_tester to test circuits without building the entire circuit
  - Allows you to test logic without the whole snarkjs set up!

## Circuit setup

Follow setup instructions from https://github.com/0xPARC/circom-ecdsa to download snarkjs and circom! https://github.com/iden3/snarkjs walks through each step in the script if you want to see the whole pipeline, which I recommend going through. Here is a very helpful diagram of that process to keep on hand while you walk through the code:

![image of snarkjs pipeline from proof generation to verification](https://fvictorio.notion.site/image/https%3a%2f%2fs3-us-west-2.amazonaws.com%2fsecure.notion-static.com%2f5f267294-acb7-4a7b-b68d-a9ffe3fa1c71%2fdiagram.png?table=block&id=2e2fd7a5-4c9e-429e-8d6b-57caa4b06b68&spaceid=999fcf0b-d32c-46d7-922b-b4a5f30b1f90&width=2000&userid=&cache=v2)

## Client setup

Go to client and run `npm run dev` to open a local version of the web app.

## Disclaimers

This repo uses a fork of snarkjs built by Nalin Bhardwaj and Vivek Bhupatiraju. It chunks zkeys to save browser memory and also loads them in from IndexedDB local storage after being downloaded. This repo is not being maintained and may be exposed to vulnerabilities in the snarkjs code we worked. So PLEASE do not use this for production level apps, and more to just test. Hopefully our additions can be upstreamed to snarkjs and maintained there!

Contact vb7401@gmail.com for any questions or bugs.
