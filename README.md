# ECDSAVerify-starter

Starter repo for web applications using ECDSAVerify

## Directories

- client stores Next.js web application with code to download ECDSAVerify circuits from a S3 bucket + use to verify code
- circuits stores all the circom circuits that the web app uses
- ecdsa-circuits stores necessary circuits from https://github.com/0xPARC/circom-ecdsa
- scripts has the snarkjs scripts to create all intermediate files for SNARK proving
  - Will likely need AWS machine with at least 32G RAM machine (AWS c5.4xlarge instance should work)
  - To run the "build\_\*\_chunks.sh" files, you'll need to clone https://github.com/nalinbhardwaj/snarkjs/commit/d1c10a6373c02eaa214968da96e2514ddc8c8b92 in the same directory as ../ECSDSAVerify-Starter
    - This will create chunked versions of the zkey that are necessary to run these proofs in browser
    - Will clean this up in the future
- test has some code using circom_tester to test circuits without building the entire circuit

## Circuit setup

Follow setup instructions from https://github.com/0xPARC/circom-ecdsa to download snarkjs and circom!

Contact vivekab@mit.edu if you have any questions!

## Client setup

Go to client and run `npm run dev` to open a local version of the web app.

## Disclaimers

This repo uses a fork of snarkjs built by Nalin Bhardwaj and Vivek Bhupatiraju. It chunks zkeys to save browser memory and also loads them in from IndexedDB local storage after being downloaded. This repo is not being maintained and may be exposed to vulnerabilities in the snarkjs code we worked. So PLEASE do not use this for production level apps, and more to just test. Hopefully our additions can be upstreamed to snarkjs and maintained there!

## Further instructions

Will be added.
