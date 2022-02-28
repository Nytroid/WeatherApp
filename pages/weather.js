import styles from '../styles/Home.module.css'
import Head from 'next/head'
import { useRouter } from "next/router"


export default function Weather() {


    return (
        <>
    <Head>
        <title>Your city's weather</title>
        </Head>

    <main className={styles.main}>
    <h1 className={styles.title}>
        Weather for 
    </h1>
    </main>
    </>
    )
}