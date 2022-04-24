import {useState} from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import {generateProof, verifyProof, downloadProofFiles, checkZkeyStorage} from '../lib/util'

const Home: NextPage = () => {
  const [status, setStatus] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [filesDownloaded, setFilesDownloaded] = useState(new Set<string>());

  const [proofType, setProofType] = useState("group_message_64_4_7")
  const [proofCount, setProofCount] = useState(0);
  const [proof, setProof] = useState("");
  const [publicSignals, setPublicSignals] = useState<Array<string>>([]);

  async function buttonDownloadFiles() {
    setDownloading(true);
    console.time(`Downloading files for ${proofType}`);
    await downloadProofFiles(proofType);
    console.timeEnd(`Downloading files for ${proofType}`);
    setDownloading(false);
    filesDownloaded.add(proofType);
  }
  
  async function buttonGenerateProof() {
    // check files are downloaded
    if (!filesDownloaded.has(proofType)) {
      if (await checkZkeyStorage(proofType)) {
        filesDownloaded.add(proofType);
      } else {
        alert("Need to download zkeys first! It may take a while.");
        return;
      }
    }

    setGenerating(true);
    console.time(`Generating proof ${proofCount}`);
    let res;
    try {
      res = await generateProof(proofType);
    } catch(e) {
      console.log(e);
      setGenerating(false);
      return;
    }
    console.timeEnd(`Generating proof ${proofCount}`);
    setGenerating(false);

    setProofCount(proofCount+1);

    setProof(res.proof);
    setPublicSignals(res.publicSignals);
    setStatus(false);
  }

  async function buttonVerifyProof() {
    if (proof === "") {
      alert("Need to generate proof!");
      return;
    } 

    setVerifying(true);
    console.time(`Verifying proof ${proofCount}`);
    const res = await verifyProof(proof, publicSignals, proofType);
    console.timeEnd(`Verifying proof ${proofCount}`);
    setVerifying(false);

    console.log(res);
    if (res.verification) {
        setStatus(true);
    } else {
        setStatus(false);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>ECSDAVerify starter</title>
        <meta name="description" content="Verify a ECDSA signature and membership in a merkle tree!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Link href="/">
          <a>
            <h1 className={styles.title}>
              ECDSAVerify Starter
            </h1>
          </a>
        </Link>

        <p className={styles.description}>
        Verify a ECDSA signature and membership in a merkle tree using{' '}
          <code className={styles.code}>zk-SNARKs</code>
          !
        </p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h2>Choose proof type</h2>
            <select onChange={(event) => setProofType(event.target.value)} defaultValue={proofType}>
              <option value="group_message_64_4_7">With ECDSAVerify</option>
              <option value="group_message_nosig_86_3_7">Without ECDSAVerify</option>
            </select>
          </div>

          <button 
            className={styles.card} 
            onClick={buttonDownloadFiles}
            disabled={downloading}
          >
            {
              (downloading) ? (
                <h2>Currently downloading...</h2>
              ) : (
                <h2>Click to download files</h2>
              )
            }
          </button>

          <button 
            className={styles.card} 
            onClick={buttonGenerateProof}
            disabled={generating}
          >
            {
              (generating) ? (
                <h2>Currently generating...</h2>
              ) : (
                <h2>Click to generate proof</h2>
              )
            }
          </button>

          <div className={styles.card}>
            <div className={styles.proofgrid}>
              <div>
                <h2>Proof contents</h2>
                <textarea rows={5} className={styles.textarea} value={JSON.stringify(proof, null, 1)} />
              </div>
              <div>
                <h2>Public signals</h2>
                <textarea rows={5} className={styles.textarea} value={JSON.stringify(publicSignals, null, 1)} />
              </div>
            </div>
          </div>

          <button 
            className={styles.card} 
            onClick={buttonVerifyProof}
            disabled={verifying}
          >
            {
              (verifying) ? (
                <h2>Currently verifying...</h2>
              ) : (
                <h2>Click to verify above proof</h2>
              )
            }
          </button>

          <div className={styles.card}>
            <h2>Proof verification: {status ? ' ✅ ' : ' ❌ '}</h2>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
      <a href='https://github.com/vb7401'>
          Built by Vivek Bhupatiraju
      </a>
      </footer>
    </div>
  )
}

export default Home
