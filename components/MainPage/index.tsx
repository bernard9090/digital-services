import React, {useState, useEffect} from "react";
import style from "../../styles/MainPage.module.css"
import Button from "../../components/Button"
import { PAGES } from "../../services/constants";
import { subscribeToService } from "../../services/restService";
import { useToasts } from "react-toast-notifications";


const MainPage = (props: any) => {

    const {service, pid, keyword, attemptId,adId} = props
    const [msisdn, setMsisdn] = useState(props.header.msisdn)
    const [smsc, setSmsc] = useState(props.header.smsc)
    const [smscAllowed, setSmscAllow] = useState(true)
    const [loading, setLoading] = useState(false)

    const [allowedServices, setAllowedNetworks] = useState<any>([])

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


    }, [service, smsc])

    
 
    return(
        <div className={style.container}>
            <h4 className={style.page_header}>Get {service.name} directly to your phone at Ghs {service.tariff} {service.billingCycle}</h4>
            <div className={style.phone_container}>
                <p className={style.phone_label}>Enter your phone number</p>

                <input value={msisdn} onChange={(e) => setMsisdn(e.target.value)} className={style.phone_input} type="text" autoFocus placeholder="Phone number"/>

                {
                    !smscAllowed && <select className={style.netowrk_select} name="network" id="network">
                    <option value="null">Select Network</option>
                    {
                        allowedServices.map((item:any, index:number) => (
                            <option key={index} value={item.key}>{item.name}</option>
                        ))
                    }
                </select>
                }

                <div style={{marginTop:"2rem"}}>
                    <Button loading={loading} text={"Subscribe"} onClick={()=> { 

                        if(msisdn !== "" && smsc !== ""){
                            setLoading(true)
                            subscribeToService(keyword, service.name, null,msisdn, pid, attemptId, smsc, adId).then(({data})=> {         
                            
                                if(smsc === "AIRTELTIGO"){
                                    props.navigate(PAGES.PIN_INPUT)
                                }else if(smsc === "MTNGH"){
                                    props.navigate(PAGES.VERIFICATION)
                                }
                            }).catch(e => {
                                addToast(`Error subscribing to ${service.name}`, {
                                    appearance:"error",
                                    autoDismiss:true
                                })
                            }).finally(()=> setLoading(false))
                        }
                       
                    } }/>
                </div>
            </div>
         </div>

    )

}

export default MainPage