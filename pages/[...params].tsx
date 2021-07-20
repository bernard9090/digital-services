import { useEffect } from "react"
import {useRouter} from "next/router"
import style from "../styles/Home.module.css"
import axios from "axios"
import { GetStaticProps, GetStaticPaths } from 'next'


const HandlePage = (props: any) => {
    console.log("incoming props",props)
    const router = useRouter()
    const {params,key, aid} = router.query

  



    return (
        <div className={style.container}>
            <div className={style.card_container}>
                <h2>Welcome</h2>
            </div>
        </div>
    )

}

export async function getStaticPaths() {
    return {
        paths: ["/[...params]"], fallback:false
    }
}

export async function getStaticProps(context:any) {
    return {
        props:{
            hello:"world"
        }
    }
}



export default HandlePage