import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

export default function Home() {


  return (
    <div className={styles.container}>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Weather App
        </h1>

        <div className={styles.grid}>
         <Link href='/lookup'> 
         <a className={styles.card}>Get your city&#39;s weather</a>
          </Link>
        </div>
      </main>
    </div>
  )
}
