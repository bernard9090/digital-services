import axios from "axios";


const BASE_URL = "https://sdp4.rancardmobility.com";
const HEADER = "http://header.rancardmobility.com/decrypt"
axios.create({
    headers:{
        "Access-Control-Allow-Origin":"*"
    }
});


export const fetchWidgetData = (providerId: string| any) => {
    return axios({
        method:"GET",
        url:`${BASE_URL}/api/v1/subscriber/widgetData`,
        params:{
            providerAccountId: providerId
        }
    })
};


export const fetchSingleServiceDetails = (providerId:any, keyword:any) => {
    return axios({
        method:"GET",
        url: `${BASE_URL}/api/v1/subscriber/widget/service/details`,
        params:{
            keyword,
            providerAccountId: providerId
        }
    })
};

export const widgetSubscriptionLookup = (service:string|any, msisdn:string) => {
    return axios({
        method:"GET",
        url:`${BASE_URL}/api/v1/subscriber/widget/subscription/lookup`,
        params:{
            service,
            msisdn
        }
    })
};

export const headerEnrichment = () => {
    console.log("header called");
    return axios({
        method: 'GET',
        url: HEADER,
        headers: {
            'Access-Control-Allow-Origin': '*',
            "msisdn": "233243729040",
            
        }
    });
};

export const sendSubscriptionAttempt = (msisdn: string,shortcode:string|null, service:string|any, providerAccountId:string|any, smsc:string, subscriptionAttemptId: string) => {
    return axios({
        method:"GET",
        url:`${BASE_URL}/api/v1/subscriber/widget/subscription/attempt`,
        params:{
            msisdn,
            shortcode,
            service,
            providerAccountId,
            smsc,
            subscriptionAttemptId

        }
    })
}


export const subscribeToService = (keyword:any, service:any,  shortcode:any, msisdn:any, providerAccountId:any,subscriptionAttemptId:any, smsc:any, adId:any) => {
    console.log(service, msisdn, providerAccountId, shortcode, keyword);
    let service_ = keyword ? keyword : service;
    return axios({
        method: "GET",
        url : `${BASE_URL}/api/v1/subscriber/widget/subscription`,
        params:{
            service:service_,
            msisdn,
            shortcode:shortcode,
            providerAccountId,
            smsc,
            advertisingId:adId,
            subscriptionAttemptId
        }
    })
};


export const confirmSubscriptionAIRTELTIGO = (otp: any, msisdn: any, providerAccountId: any, service: any) => {
    return axios({
        method:"GET",
        url:`${BASE_URL}/api/v1/subscriber/widget/subscription/tigo/confirmation`,
        params:{
            otp,
            service:service,
            msisdn,
            providerAccountId,
            
        }
    })
};