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


const Page = (props:any) => {
    const router = useRouter();
    const [serviceDetails, setServiceDetails] = useState({})
    const [page, setPage] = useState(PAGES.MAIN)
    const [widgetDetails, setWidgetDetails] = useState<any>({})
    const [subscriptionAttemptId, setSubscriptionAttemptId] = useState<any>()
   

    const {pid, keyword, adId, redirect} = router.query
    const {header} = props


  
    

    useEffect(()=> {

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
       
        widgetSubscriptionLookup(keyword, header.msisdn).then(({data}) => {
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
                sendSubscriptionAttempt(header.msisdn, null, keyword, pid, header.smsc,attemptId).then(() =>{
                    setSubscriptionAttemptId(attemptId)
                })
                
            }
        }).catch((e) => {
            
        })


    }, [pid, keyword, header.msisdn]) //react-hooks/exhaustive-deps


    const redirectToPage = useCallback((asr: string| any)  => {
        const urlParams = `asr=${encodeURIComponent(asr)}&adId=${adId}&keyword=${keyword}&smsc=${header.smsc}`;
        
        const {frontendSyncUrl} = widgetDetails
        let path;
        if(redirect){
            path  =`${redirect}?${urlParams}`;
        }else{
            path = `${frontendSyncUrl}?${urlParams}`;
        }
    }, [] )


    return (
        <div className={style.container}>
            <div className={style.card_container}>
                {
                    page === PAGES.MAIN && <MainPage 
                    header={props.header}
                    service={serviceDetails} 
                    pid={pid}
                    keyword={keyword}
                    adId={adId}
                    attemptId={subscriptionAttemptId}
                    navigate={(page: string) => setPage(page)}/>
                }

                {
                    page === PAGES.PIN_INPUT &&  <PinInput 
                    navigate={(page: string) => setPage(page)}
                    header={props.header}
                    service={serviceDetails} 
                    pid={pid}
                    keyword={keyword}
                    adId={adId}
                    attemptId={subscriptionAttemptId}/>
                }
                {
                    page === PAGES.VERIFICATION &&  <AwaitingVerification navigate={(page: string) => setPage(page)}/>
                }
            </div>
        </div>
    )
}

export const getStaticProps = async  (context:  any) => {

    

    const { serverRuntimeConfig } = getConfig()
   
    const {login_email, login_password} = serverRuntimeConfig
    const {data}  = await axios.post("http://unify_test.rancardmobility.com/api/v2/auth/signin", {
        email: login_email,
        password: login_password
    })

    serverRuntimeConfig.secret = data.accessToken

    const response = await  headerEnrichment()

    return {
        props : {
            header:response.data
        }
    }
}

export default Page