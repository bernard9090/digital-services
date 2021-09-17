import React, {useState, useEffect} from "react";
import style from "../../styles/MainPage.module.css"
import Button from "../../components/Button"
import { PAGES } from "../../services/constants";
import { subscribeToService } from "../../services/restService";
import { useToasts } from "react-toast-notifications";
import { AppContext } from "../../pages";


const MainPage = (props: any) => {

    const {service, pid, keyword, attemptId,adId, redirect, asr} = props
    const [msisdn, setMsisdn] = useState(props.header.msisdn)
    const [smsc, setSmsc] = useState(props.header.smsc)
    const [smscAllowed, setSmscAllow] = useState(true)
    const [loading, setLoading] = useState(false)
    const [smscChanged, setSsmscChanged] = useState(false)
    const [msisdnChanged, setMsisdnChanged] = useState(false)
    const [subRequestId, setSubRequestId] = useState<String>("")

    const [allowedServices, setAllowedNetworks] = useState<any>([])

    useEffect(()=> {
        if(props.header){
            setMsisdn(props.header.msisdn)
            setSmsc(props.header.smsc)
            setSubRequestId(props.header.sub_request_id)
        }
    }, [props.header])

    const {addToast} = useToasts()

    useEffect(()=> {
        if(service){
            console.log(service)
            const allowedNetworks = []
            const {mtnProductId, mtnServiceId, tigoProductId, vodaKeyword} = service
            
            if(mtnProductId || mtnServiceId){
                allowedNetworks.push({
                    name:"MTN Ghana",
                    key:"MTNGH",
                    id:mtnProductId || mtnServiceId
                })
            }
            if(tigoProductId){
                allowedNetworks.push({
                    name:"Airtel Tigo",
                    key:"AIRTELTIGO",
                    id:tigoProductId
                })
            }
            if(vodaKeyword){
                allowedNetworks.push({
                    name:"Vodafone Ghana",
                    key:"OT",
                    id:vodaKeyword
                })
            }
            console.log(allowedNetworks)
            const smscAllowed = allowedNetworks.filter(item => item.key === smsc).length > 0
            console.log(allowedNetworks,smscAllowed)
            setAllowedNetworks(allowedNetworks)
            setSmscAllow(smscAllowed)
        }


    }, [service])



    
 
    return(

        <div className={style.container}>
            <h4 className={style.page_header}>Get {service.name} directly to your phone at Ghs {service.tariff} {service.billingCycle}</h4>
            <div className={style.phone_container}>
                {!props.isSubscribed && <p className={style.phone_label}>Enter your phone number</p>}

                {
                    !props.isSubscribed && <input disabled={smscAllowed} value={msisdn} onChange={(e) => {
                        setMsisdn(e.target.value)
                        props.updateHeader({
                            ...props.header,
                            msisdn: e.target.value
                        })
                        if(!msisdnChanged){
                            setMsisdnChanged(true)
                        }
                    }} className={style.phone_input} type="text" autoFocus placeholder="Phone number"/>
                }

                {
                    !smscAllowed && !props.isSubscribed  && <select className={style.netowrk_select} onChange={(e) =>{
                        props.updateHeader({
                            ...props.header,
                            smsc: e.target.value
                        })
                        setSmsc(e.target.value)
                        setSsmscChanged(true)
                    }} name="network" id="network">
                    <option value="">Select Network</option>
                    {
                        allowedServices.map((item:any, index:number) => (
                            <option key={index} value={item.key}>{item.name}</option>
                        ))
                    }
                </select>
                }

                <div style={{marginTop:"2rem"}}>
                    {
                        props.isSubscribed ? <Button onClick={()=> props.redirect(asr)} text={"Continue"}/> : 
                        <Button loading={loading} text={"Subscribe"} onClick={()=> { 
                         
                            if(msisdn !== "" && smsc !== ""){
                                setLoading(true)
                                let subAttemptId = attemptId
                                if(msisdnChanged && smsc === "OT"){
                                    subAttemptId = null
                                }
                             
                                subscribeToService(keyword, service.name, null, msisdn, pid, subAttemptId, smsc, adId, subRequestId).then(({data})=> {         
                                
                                    const {result} = data
                                    let asrValue = "";
                                    if(result){
                                        const {asr} =  result
                                        asrValue = asr
                                        props.setAsrValue(asr)
                                    }
                                    if(smsc === "AIRTELTIGO"){
                                        props.navigate(PAGES.PIN_INPUT)
                                    }else if(smsc === "MTNGH"){
                                        props.navigate(PAGES.VERIFICATION)
                                    }else{
                                        props.redirect(asrValue)
                                    }
                                }).catch(e => {
                                    addToast(`Error subscribing to ${service.name}`, {
                                        appearance:"error",
                                        autoDismiss:true
                                    })
                                }).finally(()=> setLoading(false))
                            }
                           
                        } }/>
                    }
                    
                </div>
            </div>
         </div>
         

    )

}

export default MainPage