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
            "IMSI":"somethinghere"
        }
    });
};