

import { checkToken } from "../../../controllers/auth/auth";

export default async function fetchFacilityData(req, res) {

    
    const fetchData = async (token) => {

        const API_URL = process.env.NEXT_PUBLIC_API_URL

        // console.log({body: req.body})

        const { path, id } = req.query
    
        let url = ''
        let params =''


             // Set url based on request
             switch (path){
                case 'wards':
                    url = `${API_URL}/common/${path}/${id}/` 
                break;

                case 'facilities':
                    url = `${API_URL}/facilities/${path}/${id}/`
                break;

                case 'facility_coordinates': 
                    url = `${API_URL}/gis/${path}/?facility=${id}`
                break;

                case 'facility_updates':
                    url = `${API_URL}/facilities/${path}/${id}/`
                break;

                case `facilities_count`:
                    url =API_URL + `/reporting/?county=${req.query.id}&report_type=facility_count_by_county&report_level=county`
                break;

                case `filter_facilities_by_owners`:
                    params= JSON.parse(req.query.drilldown)
                    url =`${API_URL}/reporting/?report_type=facility_count_by_owner_category&county=${params.county}&sub_county=${params.sub_county}&ward=${params.ward}`
                break;

                case `filter_facilities_by_owners_category`:
                    params= JSON.parse(req.query.drilldown)
                    url =`${API_URL}/reporting/?report_type=facility_count_by_owner&county=${params.county}&sub_county=${params.sub_county}&ward=${params.ward}`
                break; 

                case `filter_facilities_by_type`:
                    params= JSON.parse(req.query.drilldown)
                    url =`${API_URL}/reporting/?report_type=facility_count_by_facility_type&county=${params.county}&sub_county=${params.sub_county}&ward=${params.ward}`
                break;

                case `facility_type_details`:
                    params= JSON.parse(req.query.drilldown)
                    url =`${API_URL}/reporting/?report_type=facility_count_by_facility_type_details&parent=&county=${params.county}&sub_county=${params.sub_county}&ward=${params.ward}`
                break;

                case `keph_level`:
                    params= JSON.parse(req.query.drilldown)
                    url = `${API_URL}/reporting/?report_type=facility_keph_level_report&county=${params.county}&sub_county=${params.sub_county}&ward=${params.ward}`
                break;

                case `facility_coordinates`:
                    params= JSON.parse(req.query.drilldown)
                    url = `${API_URL}/facilities/facilities/?county=${params.county}&sub_county=${params.sub_county}&ward=${params.ward}`
                break;

                case `admin_offices`:
                    params= JSON.parse(req.query.drilldown)
                    url = `${API_URL}/admin_offices/?report_type=county&county=${params.county}&sub_county=${params.sub_county}&ward=${params.ward}`
                break;

                case `chu_status`:
                    params= JSON.parse(req.query.drilldown)
                    url = `${API_URL}/reporting/chul/?report_type=status&county=${params.county}&sub_county=${params.sub_county}&ward=${params.ward}`
                break;  

                default:
                break;
            }

            try {
                console.log({url});
                const resp = await fetch(url, {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Accept': 'application/json',
                        
                    }
                })
                
                return resp.json()
                }
                catch(err) {
                    console.error('Error fetching facility data: ', err)
                    return {
                        error: true,
                        err: err.message,
                        api_url:API_URL
                    }
            }
        
    }

 

    if (req.method === "GET") {
                                                                                    
        try {
            return checkToken(req, res).then(t => {
                if (t?.error || t?.data?.error) {
                    let err = new Error('Error checking token')
                    err.status = 401
                    res.status(401).json({
                        error: true,
                        err: err,
                        message: 'Error checking token'
                    })
                } else {
                    let token = t.token
                   
                    return fetchData(token).then(dt => dt).then(data => {
                    
                        res.status(200).json(data)
                        return
                    })
                }
                return
            })
            
        } catch (err) {
            console.log("getData API error: ", err)
            res.status(500).json({
                "error": true,
                "err": err,
                "message": err.message
            });
        }
    }
     
}
