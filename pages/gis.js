import Head from 'next/head'
import Link from 'next/link'
import MainLayout from '../components/MainLayout'
import { CheckCircleIcon, InformationCircleIcon, LocationMarkerIcon, LockClosedIcon, XCircleIcon } from '@heroicons/react/solid'
import { checkToken } from '../controllers/auth/auth'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import * as Tabs from '@radix-ui/react-tabs';

const Gis = (props) => {
    const Map = dynamic(
        () => import('../components/GISMap'), // replace '@components/map' with your component's location
        {
            loading: () => <div className="text-gray-800 text-lg rounded bg-white py-2 px-5 shadow w-auto mx-2 my-3">Loading&hellip;</div>,
            ssr: false
        } // This line is important. It's what prevents server-side render
    )

    const router = useRouter()
    console.log('props::: ',Object.keys(props))
    let facilities = props?.data?.results
    let filters = props?.filters
    let fltrs = filters
    let [drillDown, setDrillDown] = useState({})
    if(filters){
        filters["has_edits"] = [{ id: "has_edits", name: "Has edits" },]
        filters["is_approved"] = [{ id: "is_approved", name: "Is approved" }]
        filters["is_complete"] = [{ id: "is_complete", name: "Is complete" }]
        filters["number_of_beds"] = [{ id: "number_of_beds", name: "Number of beds" }]
        filters["number_of_cots"] = [{ id: "number_of_cots", name: "Number of cots" }]
        filters["open_whole_day"] = [{ id: "open_whole_day", name: "Open whole day" }]
        filters["open_weekends"] = [{ id: "open_weekends", name: "Open weekends" }]
        filters["open_public_holidays"] = [{ id: "open_public_holidays", name: "Open public holidays" }]
        delete fltrs.has_edits
        delete fltrs.is_approved
        delete fltrs.is_complete
        delete fltrs.number_of_beds
        delete fltrs.number_of_cots
        delete fltrs.open_whole_day
        delete fltrs.open_weekends
        delete fltrs.open_public_holidays
    }

    useEffect(() => {
        if (filters && Object.keys(filters).length > 0) {

            Object.keys(filters).map(ft => {
                if (props?.query[ft] && props?.query[ft] != null && props?.query[ft].length > 0) {
                    setDrillDown({ ...drillDown, [ft]: props?.query[ft] })
                }
            })
        }
    }, [filters])


    return (
        <div className="">
            <Head>
                <title>KMHFL - Facilities</title>
                <link rel="icon" href="/favicon.ico" />
                <link rel="stylesheet" href="/assets/css/leaflet.css" />
            </Head>

            <MainLayout isLoading={false} searchTerm={props?.query?.searchTerm} isFullWidth>
                <>
                    {props?.error ? (
                        <div className="w-full flex flex-col gap-5 px-1 md:px-4 p-4 my-4 mx-auto bg-gray-100 min-h-screen items-center">
                            <div className="flex flex-col items-center justify-center bg-red-100 rounded border border-red-300 shadow w-full max-w-screen-sm">
                                <h1 className="text-red-700 text-3xl flex items-center gap-x-2">
                                    <XCircleIcon className="text-red-500 h-4 w-4 text-5xl" />
                                    <span>Error</span>
                                </h1>
                                <p className="text-red-800 text-lg">{props?.err.toString()}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full grid grid-cols-5 gap-5 px-1 md:px-4 p-4 my-4 mx-auto bg-gray-100 min-h-screen">
                            <aside className="col-span-5 md:col-span-1 p-2 md:p-4 flex flex-col gap-4 items-center justify-start bg-white rounded-lg shadow">
                                {/* ---- */}
                                <Tabs.Root orientation="horizontal" className="w-full flex flex-col tab-root flex-grow" defaultValue="facilities">
                                    <Tabs.List className="list-none flex flex-wrap gap-2 md:gap-3 px-4 uppercase leading-none tab-list font-semibold border-b">
                                        <Tabs.Tab value="facilities" className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item">
                                            Facilities
                                        </Tabs.Tab>
                                        <Tabs.Tab value="cunits" className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item">
                                            Community Units
                                        </Tabs.Tab>
                                    </Tabs.List>
                                    <Tabs.Panel value="facilities" className="grow-1 py-1 px-4 tab-panel">
                                        <div className="col-span-4 md:col-span-4 flex flex-col group items-center justify-start text-left">
                                            <div className="bg-white w-full p-2 rounded">
                                                {props?.data && props?.data?.results && <h4 className="text-xl tracking-tight font-bold leading-3">{props?.data?.results?.length} facilities found.</h4>}
                                            </div>
                                            {/* 000000000 */}
                                            <details className="rounded bg-transparent py-1 flex flex-col w-full md:stickyz" open>
                                                <summary className="flex cursor-pointer w-full bg-white p-0">
                                                    <h5 className="text-xl font-semibold">Filters</h5>
                                                </summary>
                                                <div className="flex flex-col gap-1 p-1">
                                                    {filters && filters?.error ?
                                                        (<div className="w-full rounded bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base">
                                                            <p>No filters.</p>
                                                        </div>)
                                                        : (
                                                            <form action="/" onSubmit={ev => {
                                                                ev.preventDefault()
                                                                return false
                                                            }}>
                                                                {filters && Object.keys(filters).length > 0 &&
                                                                    Object.keys(fltrs).map(ft => (
                                                                        <div key={ft} className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                                            <label htmlFor={ft} className="text-gray-600 capitalize text-sm">{ft.split('_').join(' ')}</label>
                                                                            <select name={ft} defaultValue={props?.query[ft] || ""} id={ft} className="w-full p-2 rounded bg-gray-100" onChange={sl => {
                                                                                let nf = {}
                                                                                nf[ft] = sl.target.value
                                                                                setDrillDown({ ...drillDown, ...nf })
                                                                                // updateFt(nf)
                                                                            }}>
                                                                                <option value="">All</option>
                                                                                {filters && filters[ft].map(ft_opt => (
                                                                                    <option key={ft_opt.id} value={ft_opt.id}>{ft_opt.name}</option>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                    ))}
                                                                <div className="w-full flex flex-row items-center px-2 justify-between gap-1 gap-x-3 mb-3">
                                                                    <label htmlFor="has_edits" className="text-gray-700 capitalize text-sm flex-grow">Has edits</label>
                                                                    <span className="flex items-center gap-x-1">
                                                                        <input type="radio" value={true} defaultChecked={props?.query?.has_edits === "true"} name="has_edits" id="has_edits" onChange={ev => {
                                                                            setDrillDown({ ...drillDown, 'has_edits': true })
                                                                        }} />
                                                                        <small className="text-gray-700">Yes</small>
                                                                    </span>
                                                                    <span className="flex items-center gap-x-1">
                                                                        <input type="radio" value={false} defaultChecked={props?.query?.has_edits === "false"} name="has_edits" id="has_edits" onChange={ev => {
                                                                            setDrillDown({ ...drillDown, 'has_edits': false })
                                                                        }} />
                                                                        <small className="text-gray-700">No</small>
                                                                    </span>
                                                                </div>
                                                                <div className="w-full flex flex-row items-center px-2 justify-between gap-1 gap-x-3 mb-3">
                                                                    <label htmlFor="is_approved" className="text-gray-700 capitalize text-sm flex-grow">Approved</label>
                                                                    <span className="flex items-center gap-x-1">
                                                                        <input type="radio" value={true} defaultChecked={props?.query?.is_approved === "true"} name="is_approved" id="is_approved" onChange={ev => {
                                                                            setDrillDown({ ...drillDown, 'is_approved': true })
                                                                        }} />
                                                                        <small className="text-gray-700">Yes</small>
                                                                    </span>
                                                                    <span className="flex items-center gap-x-1">
                                                                        <input type="radio" value={false} defaultChecked={props?.query?.is_approved === "false"} name="is_approved" id="is_approved" onChange={ev => {
                                                                            setDrillDown({ ...drillDown, 'is_approved': false })
                                                                        }} />
                                                                        <small className="text-gray-700">No</small>
                                                                    </span>
                                                                </div>
                                                                <div className="w-full flex flex-row items-center px-2 justify-between gap-1 gap-x-3 mb-3">
                                                                    <label htmlFor="is_complete" className="text-gray-700 capitalize text-sm flex-grow">Complete</label>
                                                                    <span className="flex items-center gap-x-1">
                                                                        <input type="radio" value={true} defaultChecked={props?.query?.is_complete === "true"} name="is_complete" id="is_complete" onChange={ev => {
                                                                            setDrillDown({ ...drillDown, 'is_complete': true })
                                                                        }} />
                                                                        <small className="text-gray-700">Yes</small>
                                                                    </span>
                                                                    <span className="flex items-center gap-x-1">
                                                                        <input type="radio" value={false} defaultChecked={props?.query?.is_complete === "false"} name="is_complete" id="is_complete" onChange={ev => {
                                                                            setDrillDown({ ...drillDown, 'is_complete': false })
                                                                        }} />
                                                                        <small className="text-gray-700">No</small>
                                                                    </span>
                                                                </div>
                                                                <div className="w-full flex flex-row items-center px-2 justify-between gap-1 gap-x-3 mb-3">
                                                                    <label htmlFor="number_of_beds" className="text-gray-700 capitalize text-sm flex-grow">Has beds</label>
                                                                    <span className="flex items-center gap-x-1">
                                                                        <input type="radio" value={true} defaultChecked={props?.query?.number_of_beds === "true"} name="number_of_beds" id="number_of_beds" onChange={ev => {
                                                                            setDrillDown({ ...drillDown, 'number_of_beds': true })
                                                                        }} />
                                                                        <small className="text-gray-700">Yes</small>
                                                                    </span>
                                                                    <span className="flex items-center gap-x-1">
                                                                        <input type="radio" value={false} defaultChecked={props?.query?.number_of_beds === "false"} name="number_of_beds" id="number_of_beds" onChange={ev => {
                                                                            setDrillDown({ ...drillDown, 'number_of_beds': false })
                                                                        }} />
                                                                        <small className="text-gray-700">No</small>
                                                                    </span>
                                                                </div>
                                                                <div className="w-full flex flex-row items-center px-2 justify-between gap-1 gap-x-3 mb-3">
                                                                    <label htmlFor="number_of_cots" className="text-gray-700 capitalize text-sm flex-grow">Has cots</label>
                                                                    <span className="flex items-center gap-x-1">
                                                                        <input type="radio" value={true} defaultChecked={props?.query?.number_of_cots === "true"} name="number_of_cots" id="number_of_cots" onChange={ev => {
                                                                            setDrillDown({ ...drillDown, 'number_of_cots': true })
                                                                        }} />
                                                                        <small className="text-gray-700">Yes</small>
                                                                    </span>
                                                                    <span className="flex items-center gap-x-1">
                                                                        <input type="radio" value={false} defaultChecked={props?.query?.number_of_cots === "false"} name="number_of_cots" id="number_of_cots" onChange={ev => {
                                                                            setDrillDown({ ...drillDown, 'number_of_cots': false })
                                                                        }} />
                                                                        <small className="text-gray-700">No</small>
                                                                    </span>
                                                                </div>
                                                                <div className="w-full flex flex-row items-center px-2 justify-between gap-1 gap-x-3 mb-3">
                                                                    <label htmlFor="open_whole_day" className="text-gray-700 capitalize text-sm flex-grow">Open 24 hours</label>
                                                                    <span className="flex items-center gap-x-1">
                                                                        <input type="radio" value={true} defaultChecked={props?.query?.open_whole_day === "true"} name="open_whole_day" id="open_whole_day" onChange={ev => {
                                                                            setDrillDown({ ...drillDown, 'open_whole_day': true })
                                                                        }} />
                                                                        <small className="text-gray-700">Yes</small>
                                                                    </span>
                                                                    <span className="flex items-center gap-x-1">
                                                                        <input type="radio" value={false} defaultChecked={props?.query?.open_whole_day === "false"} name="open_whole_day" id="open_whole_day" onChange={ev => {
                                                                            setDrillDown({ ...drillDown, 'open_whole_day': false })
                                                                        }} />
                                                                        <small className="text-gray-700">No</small>
                                                                    </span>
                                                                </div>
                                                                <div className="w-full flex flex-row items-center px-2 justify-between gap-1 gap-x-3 mb-3">
                                                                    <label htmlFor="open_weekends" className="text-gray-700 capitalize text-sm flex-grow">Open weekends</label>
                                                                    <span className="flex items-center gap-x-1">
                                                                        <input type="radio" value={true} defaultChecked={props?.query?.open_weekends === "true"} name="open_weekends" id="open_weekends" onChange={ev => {
                                                                            setDrillDown({ ...drillDown, 'open_weekends': true })
                                                                        }} />
                                                                        <small className="text-gray-700">Yes</small>
                                                                    </span>
                                                                    <span className="flex items-center gap-x-1">
                                                                        <input type="radio" value={false} defaultChecked={props?.query?.open_weekends === "false"} name="open_weekends" id="open_weekends" onChange={ev => {
                                                                            setDrillDown({ ...drillDown, 'open_weekends': false })
                                                                        }} />
                                                                        <small className="text-gray-700">No</small>
                                                                    </span>
                                                                </div>
                                                                <div className="w-full flex flex-row items-center px-2 justify-between gap-1 gap-x-3 mb-3">
                                                                    <label htmlFor="open_public_holidays" className="text-gray-700 capitalize text-sm flex-grow">Open holidays</label>
                                                                    <span className="flex items-center gap-x-1">
                                                                        <input type="radio" value={true} defaultChecked={props?.query?.open_public_holidays === "true"} name="open_public_holidays" id="open_public_holidays" onChange={ev => {
                                                                            setDrillDown({ ...drillDown, 'open_public_holidays': true })
                                                                        }} />
                                                                        <small className="text-gray-700">Yes</small>
                                                                    </span>
                                                                    <span className="flex items-center gap-x-1">
                                                                        <input type="radio" value={false} defaultChecked={props?.query?.open_public_holidays === "false"} name="open_public_holidays" id="open_public_holidays" onChange={ev => {
                                                                            setDrillDown({ ...drillDown, 'open_public_holidays': false })
                                                                        }} />
                                                                        <small className="text-gray-700">No</small>
                                                                    </span>
                                                                </div>
                                                                <button onClick={ev => {
                                                                    router.push({
                                                                        pathname: '/gis',
                                                                        query: {
                                                                            ...props?.query,
                                                                            ...drillDown
                                                                        }
                                                                    })
                                                                    // if (Object.keys(drillDown).length > 0) {
                                                                    //     let qry = Object.keys(drillDown).map(function (key) {
                                                                    //         let er = ''
                                                                    //         if (props.path && !props.path.includes(key + '=')) {
                                                                    //             er = encodeURIComponent(key) + '=' + encodeURIComponent(drillDown[key]);
                                                                    //         }
                                                                    //         return er
                                                                    //     }).join('&')
                                                                    //     let op = '?'
                                                                    //     if (props.path && props.path.includes('?') && props.path.includes('=')) { op = '&' }
                                                                    //     console.log(props.path)
                                                                    //     // setDrillDown({})
                                                                    //     if (typeof window !== 'undefined' && window) {
                                                                    //         window.location.href = props.path + op + qry
                                                                    //     } else {
                                                                    //         router.push(props.path + op + qry)
                                                                    //     }
                                                                    // }
                                                                }} className="bg-black border-2 border-black text-white hover:bg-green-800 focus:bg-green-800 active:bg-green-800 font-semibold px-5 py-1 text-lg rounded w-full whitespace-nowrap text-center uppercase">Apply Filters</button>
                                                                <div className="w-full flex items-center py-2 justify-center">
                                                                    <button className="cursor-pointer text-sm bg-transparent text-blue-700 hover:text-black hover:underline focus:text-black focus:underline active:text-black active:underline" onClick={ev => {
                                                                        router.push('/gis')
                                                                    }}>Clear filters</button>
                                                                </div>
                                                            </form>
                                                        )
                                                    }
                                                </div>
                                            </details>
                                            {/* 000000000 */}
                                        </div>
                                    </Tabs.Panel>
                                    <Tabs.Panel value="cunits" className="grow-1 py-1 px-4 tab-panel">
                                        <div className="col-span-4 md:col-span-4 flex flex-col group items-center justify-start text-left">
                                            <div className="bg-white w-full p-4 rounded">

                                            </div>
                                        </div>
                                    </Tabs.Panel>
                                </Tabs.Root>
                                {/* ---- */}
                            </aside>
                            <div className="col-span-5 md:col-span-4 flex flex-col gap-4 items-center justify-center bg-green-100 rounded-lg shadow-lg border border-gray-300">
                                <Map data={props?.data?.results || []} />
                            </div>
                        </div>
                    )}
                </>
            </MainLayout>
        </div>
    )
}

Gis.getInitialProps = async (ctx) => {
    const API_URL = process.env.API_URL || 'https://api.kmhfltest.health.go.ke/api'
    let host = ctx.req ? ctx.req.headers.host : window.location.hostname
    
    let all_facilities = []

    const fetchFilters = token => {
        let filters_url = API_URL + '/common/filtering_summaries/?fields=county%2Cfacility_type%2Cconstituency%2Cward%2Coperation_status%2Cservice_category%2Cowner_type%2Cowner%2Cservice%2Ckeph_level%2Csub_county'

        return fetch(filters_url, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json'
            }
        }).then(r => r.json())
            .then(json => {
                return json
            }).catch(err => {
                console.log('Error fetching filters: ', err)
                return {
                    error: true,
                    err: err,
                    filters: []
                }
            })
    }

    const getMorePagedData = async (next_url, token) => {
        return fetch(next_url, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json'
            }
        }).then(res => res.json()).then(data => {
            if (data.results) {
                all_facilities.push(...data.results)
            } else {
                console.log('getData: no results from ', next_url)
            }
            if (data.next) {
                console.log('::::::::::: even more data to be fetched seemingly. ', data.next)
                return getMorePagedData(data.next, token)
            } else {
                return {
                    data: { "results": all_facilities }, query, filters: { ...ft }, path: ctx.asPath || '/facilities'
                }
            }
        })
    }

    const fetchData = (token) => {
        let url = API_URL + '/facilities/facilities/?fields=id,code,official_name,facility_type_name,owner_name,operation_status_name,name,is_complete,approved_national_level,has_edits,approved,rejected,keph_level,lat_long&page_size=600'
        let query = { 'searchTerm': '' }
        if (ctx?.query?.q) {
            query.searchTerm = ctx.query.q
            url += `&search={"query":{"query_string":{"default_field":"name","query":"${ctx.query.q}"}}}`
        }
        let other_posssible_filters = ["owner_type", "service", "facility_type", "county", "service_category", "sub_county", "keph_level", "owner", "operation_status", "constituency", "ward", "has_edits", "is_approved", "is_complete", "number_of_beds", "number_of_cots", "open_whole_day", "open_weekends", "open_public_holidays"]
        other_posssible_filters.map(flt => {
            if (ctx?.query[flt]) {
                query[flt] = ctx?.query[flt]
                url += "&" + flt + "=" + ctx?.query[flt]
            }
        })

        if (ctx?.query?.page) {
            url = `${url}&page=${ctx.query.page}`
        }
        console.log('running fetchData(' + url + ')')
        return fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json'
            }
        }).then(r => r.json())
            .then(json => {
                return fetchFilters(token).then(ft => {
                    ///////
                    console.log('fetchFilters has EXECUTEDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD')
                    console.log('JSON:::: ', Object.keys(json))
                    all_facilities.push(...json.results)
                    if (json.next) {
                        if (host.includes('localhost')) {
                            return {
                                data: { "results": all_facilities }, query, filters: { ...ft }, path: ctx.asPath || '/facilities'
                            }
                        }
                        return getMorePagedData(json.next, token).then(data => {
                            console.log('multi pages, pulling from: ', json.next)
                            return data
                        })
                    } else {
                        return { data: { results: all_facilities }, query, filters: { ...ft }, path: ctx.asPath || '/facilities' }
                    }
                    ///////
                })
            }).catch(err => {
                console.log('Error fetching facilities: ', err)
                return {
                    error: true,
                    err: err,
                    data: [],
                    query: {},
                    path: ctx.asPath || '/facilities'
                }
            })
    }
    return checkToken(ctx.req, ctx.res).then(t => {
        let token = t.token

        return fetchData(token).then(t => t)
    }).catch(err => {
        console.log('Error checking token: ', err)
        return {
            error: true,
            err: err,
            data: [],
            query: {},
            path: ctx.asPath || '/facilities'
        }
    })

}

export default Gis