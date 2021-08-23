import React, {useEffect} from 'react'
import { widgetSubscriptionLookup } from '../../services/restService';
import { useToasts } from 'react-toast-notifications';
import { PAGES } from '../../services/constants';

const MTN_TIMEOUT = 60 * 1000;

const AwaitingVerification = (props:any) => {

    const {keyword, header,redirect, navigate} = props

    const {addToast} = useToasts()

    useEffect(()=> {
        let sublookupDebounce = setInterval(function() {
            widgetSubscriptionLookup(keyword, header.sub_request_id, header.msisdn).then(({data})=>{
                console.log("regular check data ", data);
                if(data.result){
                    clearInterval(sublookupDebounce);
                    redirect(header.msisdn)
                }
            });
        },  10 * 1000);

        setTimeout(()=>{
            addToast("Your subscription was not successful", {
                appearance:"error",
                autoDismiss:true
            })
            clearInterval(sublookupDebounce);
            navigate(PAGES.MAIN)
        }, MTN_TIMEOUT)
    }, [])


    return (
        <div style={{
            display:"flex",
            alignItems:"center",
            justifyContent:"center"
        }}>
            <p style={{textAlign:"center" }}>Your subscription is being processed. If you didn&apos;t receive any USSD prompt, Please dial *175# and send 2 to confirm.</p>


        </div>
    )

}

export default AwaitingVerification