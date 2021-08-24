import React, {useState, useEffect, useCallback} from "react";
import axios from "axios";
import { useRouter } from "next/router";
import getConfig from 'next/config'
import style from "../styles/Home.module.css"
import { fetchSingleServiceDetails, headerEnrichment, widgetSubscriptionLookup, fetchWidgetData,sendSubscriptionAttempt } from "../services/restService";
import MainPage from "../components/MainPage";
import PinInput from "../components/PinInput";
import AwaitingVerification from "../components/AwaitingVerification";
import { PAGES } from "../services/constants";
import { v4 as uuidv4 } from 'uuid';
import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"

export const AppContext = React.createContext({})


const Page = (props:any) => {
    const router = useRouter();
    const [serviceDetails, setServiceDetails] = useState<any>({})
    const [page, setPage] = useState(PAGES.MAIN)
    const [widgetDetails, setWidgetDetails] = useState<any>({})
    const [subscriptionAttemptId, setSubscriptionAttemptId] = useState<any>("")
    const [header, setHeader] = useState<any>({})
   

    const {pid, keyword, adId, redirect} = router.query

 


  
    

    useEffect(()=> {
        console.log(props)

        // fetch widget data for frontend sync
        fetchWidgetData(pid).then(({data})=> {
            const {result} =  data
            console.log(result)
            setWidgetDetails(result)
        }).catch(e => {})

        fetchSingleServiceDetails(pid, keyword).then(({data})=> {
            const {result} =  data
            setServiceDetails(result)
        }).catch(e => {

        })


        headerEnrichment(props.token, pid, keyword).then(({data})=> {
            console.log("header en", data)
            setHeader(data)
            const {smsc, msisdn, sub_request_id} = data

            widgetSubscriptionLookup(keyword, sub_request_id,  msisdn).then(({data}) => {
                console.log("widget lookup", data)
                const {result} = data
                if(result){
                    const {subscribed, asr} = result
                    if(subscribed){
                        // do the redirect here
                        redirectToPage(asr)
                    }
                }else{
                    // first time here, send the sub attempt id
                    const attemptId = uuidv4();
                    sendSubscriptionAttempt(msisdn, null, keyword, pid, smsc, attemptId).then(() =>{
                        setSubscriptionAttemptId(attemptId)
                    })
                    
                }
            }).catch((e) => {
                
            })
        })
       
        


    }, [pid, keyword]) //react-hooks/exhaustive-deps


    const redirectToPage = useCallback((asr: string| any)  => {
        const urlParams = `asr=${encodeURIComponent(asr)}&adId=${adId}&keyword=${keyword}&smsc=${header.smsc}`;
        
        const {frontendSyncUrl} = widgetDetails
        let path;
        if(redirect){
            path  =`${redirect}?${urlParams}`;
        }else{
            path = `${frontendSyncUrl}?${urlParams}`;
        }
        window.location.replace(path)
    }, [] )


    return (

       
        <AppContext.Provider value={[header, setHeader]}>
            <Head>
                <title>{serviceDetails.name}</title>
            </Head>
        <div className={style.container} >

        <Image 
        className={styles.bacground_image}
        objectPosition="center"
        src={widgetDetails.backgroundImage ? widgetDetails.backgroundImage : "/assets/wdbg.png"}
        layout="fill"
        objectFit="contain"
        quality={100}/>
            <div className={style.card_container}>
                {
                    page === PAGES.MAIN && <MainPage 
                    header={header}
                    service={serviceDetails} 
                    pid={pid}
                    keyword={keyword}
                    adId={adId}
                    redirect={(asr: any) => redirectToPage(asr)}
                    attemptId={subscriptionAttemptId}
                    updateHeader={(header: any) => {
                        setHeader(header)
                    }}
                    navigate={(page: string) => setPage(page)}/>
                }

                {
                    page === PAGES.PIN_INPUT &&  <PinInput 
                    navigate={(page: string) => setPage(page)}
                    header={header}
                    service={serviceDetails} 
                    pid={pid}
                    keyword={keyword}
                    adId={adId}
                    redirect={(asr: any) => redirectToPage(asr)}
                    attemptId={subscriptionAttemptId}/>
                }
                {
                    page === PAGES.VERIFICATION &&  <AwaitingVerification 
                    header={header}
                    service={serviceDetails} 
                    pid={pid}
                    keyword={keyword}
                    adId={adId}
                    redirect={(asr: any) => redirectToPage(asr)}
                    attemptId={subscriptionAttemptId}
                    navigate={(page: string) => setPage(page)}/>
                }
            </div>
        </div>

        </AppContext.Provider>
        
    )
}

export const getServerSideProps = async  (context:  any) => {

    

    const { serverRuntimeConfig } = getConfig()
   
    const {login_email, login_password} = serverRuntimeConfig
    const data  = await axios.post("https://sdp6.rancardmobility.com/api/v1/user/login", {
        email: login_email,
        password: login_password
    })

    console.log("login",data.headers.authorization)

   // serverRuntimeConfig.secret = data.accessToken


    return {
        props : {
            token:data.headers.authorization
        }
    }
}


export default Page


