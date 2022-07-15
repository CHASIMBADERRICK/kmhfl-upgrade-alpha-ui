// React imports
import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '../components/MainLayout';
import { checkToken } from '../controllers/auth/auth';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import {ChevronDoubleLeftIcon} from '@heroicons/react/solid';
import { PlusIcon } from "@heroicons/react/solid";
import Select from 'react-select';

const AddUser=(props)=> {

    const [formId, setFormId] = useState(0)
	const [contactList, setContactList]=useState([{contactType: "", contactDetails: ""}])
	const [subCountyOptions, setSubCountyOptions] = useState([])

	let jobs = props?.data?.results
	let contact_types = props?.filters[0].params.results
	let groups = props?.filters[1].params.results
	let counties = props?.filters[2].params.results
	let regbodies = props?.filters[3].params.results

	const [userData, setUserData]=useState({
		first_name:      {name: "first_name" ,         value: null },
		last_name:       {name: "last_name" ,          value: null },
		other_names:     {name: "other_names",         value: null },
		email:           {name: "email",               value: null },
		employee_number: {name: "employee_number",     value: null },
		job_title:       {name: "job_title", 		   value: null },
		password:        {name: "password",            value: null },
		contact_type:    {name: "contact_type",        value: null },
		contact_details: {name: "contact_details",     value: null },
		group:           {name: "group",               value: [] },
		county:          {name: "county",              value: [] },
		sub_county:      {name: "sub_county",          value: [] },
		regulatory_body: {name: "regulatory_body",     value: [] } 
	})

	const handleAddClick = () => {
		setContactList([...contactList, { contactType: "", contactDetails: "" }]);
	};

	const handleOnChange =(val)=>{
		console.log(val);
		if (val.target && val.target != undefined && val.target != null) {
            const newObj = {}
            newObj[val.target.name] = {}
            newObj[val.target.name].name = val.target.name
            newObj[val.target.name].value = val.target.value
            setUserData({ ...userData, ...newObj })
        }else if(val?.group){
			const newObj2={}
				newObj2['group'] = {}
				newObj2['group'].name = "group"
				newObj2['group'].value = val.group
		    	setUserData({ ...userData, ...newObj2 })
		}else if(val?.regulatory_body){
			const newObj3={}
				newObj3['regulatory_body'] = {}
				newObj3['regulatory_body'].name = "regulatory_body"
				newObj3['regulatory_body'].value = val.regulatory_body
		    	setUserData({ ...userData, ...newObj3 })
		}
		else {
            const newObj1 = {}
            newObj1[val.name] = {}
            newObj1[val.name].name = val.name
            newObj1[val.name].value = val.value
            setUserData({ ...userData, ...newObj1 })
        }
	}

	const selectedGroups = userData.group.value.map((ft)=>{
		return{ id: ft.value}
	})

	console.log(userData);
	console.log(selectedGroups);
	const handleSubCounties =  async (ev)=>{
		const optionsSubCounty = []
		for(var i=0;i<ev.length;i++) {
			const dataSubCounties = await fetch(`/api/filters/subcounty/?county=${ev[i].value}`)
			.then(r=>r.json()).then(r => {
				r.results.forEach((t,i) => {
					optionsSubCounty.push({value: t.id, label: t.name})
				})
				
			})
		}
		setSubCountyOptions(optionsSubCounty)
	}
	const handleBasicDetailsSubmit =()=>{

	}
// console.log(props);
  return (
    <MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>
        <div className="w-full grid grid-cols-5 gap-4 px-1 md:px-4 py-2 my-4">
                    <div className="col-span-5 flex flex-col gap-3 md:gap-5 px-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-sm md:text-base py-3">
                            <div className="flex flex-row items-center justify-between gap-2 text-sm md:text-base py-3">
                                <a className="text-indigo-700" href="/">Home</a> {'>'}
                                <a className="text-indigo-700" href="/users">Users</a> {'>'}
                                <span className="text-gray-500">Add user</span>
                            </div>
                            <div className="flex flex-wrap items-center justify-evenly gap-x-3 gap-y-2 text-sm md:text-base py-3">
                            
                            </div>
                        </div>
                  
                    </div>

					{/* Stepper and Form */}
					<div className='col-span-5 md:col-span-4 flex flex-col items-center border rounded pt-8 pb-4 gap-4 mt-2 order-last md:order-none'>
						{/* Stepper Header */}
						<div className='flex flex-col justify-center items-center px-1 md:px-4 w-full '>
							<Box sx={{ width: '100%' }}>
								<Stepper activeStep={parseInt(formId)} alternativeLabel>
									{/* {steps.map((label) => (
										<Step key={label}>
											<StepLabel>{label}</StepLabel>
										</Step>
									))} */}
								</Stepper>
							</Box>
						</div>

						{/* Stepper Body */}
						<div className='flex flex-col justify-center items-start px-1 md:px-4 w-full '>
							<div
								className=' w-full flex flex-col items-start p-3 rounded border border-gray-300/70 bg-gray-50'
								style={{ minHeight: '250px' }}>
								
											
											{/* return ( */}
												<>
													<h4 className='text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900'>
														Bio Details
													</h4>
													<form
														className='flex flex-col w-full items-start justify-start gap-3'
														onSubmit={handleBasicDetailsSubmit}
                                                        >
														{/* first name*/}
														<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
															<label
																htmlFor='first_name'
																className='text-gray-600 capitalize text-sm'>
																First Name
																<span className='text-medium leading-12 font-semibold'>
																	{' '}
																	*
																</span>
															</label>
															<input
																required
																type='text'
																name='first_name'
																onChange={ev => {
																	// console.log(ev);
																	handleOnChange(
																		ev
																	)
																}}
																value={userData['first_name']?.value || ''}
																className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
															/>
														</div>
														{/* Last name */}
														<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
															<label
																htmlFor='last_name'
																className='text-gray-600 capitalize text-sm'>
																Last Name
																<span className='text-medium leading-12 font-semibold'>
																	{' '}
																	*
																</span>
															</label>
															<input
																required
																type='text'
																name='last_name'
																onChange={ev => {
																	handleOnChange(
																		ev
																	)
																}}
																value={userData['last_name']?.value || ''}
																className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
															/>
														</div>
														{/* Other names */}
														<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
															<label
																htmlFor='other_names'
																className='text-gray-600 capitalize text-sm'>
																Other Names
																<span className='text-medium leading-12 font-semibold'>
																	{' '}
																	*
																</span>
															</label>
															<input
																required
																type='text'
																name='other_names'
																onChange={ev => {
																	handleOnChange(
																		ev
																	)
																}}
																value={userData['other_names']?.value || ''}
																className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
															/>
														</div>

														{/* Email */}
														<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
															<label
																htmlFor='email'
																className='text-gray-600 capitalize text-sm'>
																Email
																<span className='text-medium leading-12 font-semibold'>
																	{' '}
																	*
																</span>
															</label>
															<input
																required
																type='email'
																name='email'
																onChange={ev => {
																	handleOnChange(
																		ev
																	)
																}}
																value={userData['email']?.value || ''}
																className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
															/>
														</div>

														{/* Employee Number */}
														<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
															<label
																htmlFor='employee_number'
																className='text-gray-600 capitalize text-sm'>
																Employee Number
																<span className='text-medium leading-12 font-semibold'>
																	{' '}
																	*
																</span>
															</label>
															<input
																required
																type='text'
																name='employee_number'
																onChange={ev => {
																	handleOnChange(
																		ev
																	)
																}}
																value={userData['employee_number']?.value || ''}
																className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
															/>
														</div>

														{/* Job Title */}
														<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
															<label
																htmlFor='job_title'
																className='text-gray-600 capitalize text-sm'>
																Job Title
																<span className='text-medium leading-12 font-semibold'>
																	{' '}
																	*
																</span>
															</label>
															<Select
																options={
																	Array.from(jobs || [],
																		fltopt => {
																			return {
																				value: fltopt.id, label: fltopt.name
																			}
																		})
																}
																required
																placeholder='Select job title..'
																onChange={ev => {
																	handleOnChange(
																		ev
																	)
																}}
																value={userData['job_title']?.value || ''}
																name='job_title'
																className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
															/>
														</div>

														{/* Password */}
														<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
															<label
																htmlFor='password'
																className='text-gray-600 capitalize text-sm'>
																Password
																<span className='text-medium leading-12 font-semibold'>
																	{' '}
																	*
																</span>
															</label>
															<input
																required
																type='text'
																name='password'
																onChange={ev => {
																
																	handleOnChange(
																		ev
																	)
																}}
																value={userData['password']?.value || ''}

																className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
															/>
														</div>
                                                        {/* confirm password */}
                                                        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
															<label
																htmlFor='conf-password'
																className='text-gray-600 capitalize text-sm'>
																Confirm Password
																<span className='text-medium leading-12 font-semibold'>
																	{' '}
																	*
																</span>
															</label>
															<input
																required
																type='text'
																name='conf_password'
																className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
															/>
														</div>

														{/* Contacts */}

														<div className=' w-full flex flex-col items-start justify-start p-3 rounded border border-gray-300/70 bg-gray-50 h-auto'>
															<h4 className='text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900'>
																Contacts
															</h4>
															{contactList.length > 1?  contactList.map((x,i)=>{
																return <div className='w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3'>
																<div className='w-full flex flex-col items-left px-2 justify-  gap-1 gap-x-3 mb-3'>
																	<label
																		htmlFor='contact_type'
																		className='text-gray-600 capitalize text-sm'>
																		Contact Type
																		<span className='text-medium leading-12 font-semibold'>
																			{' '}
																			*
																		</span>
																	</label>	
																	<Select
																		options={
																			Array.from(contact_types || [],
																				fltopt => {
																					return {
																						value: fltopt.id, label: fltopt.name
																					}
																				})
																		}
																		
																		required
																		placeholder='Select contact type..'
																		// value={x.contactType}
																		onChange={ev => {
																			handleOnChange(
																				ev
																			)
																		}}
																		value={userData['contact_type']?.value || ''}
																		name='contact_type'
																		className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
																	/>
																</div>	
																<div className='w-full flex flex-col items-left px-2 justify-  gap-1 gap-x-3 mb-3'>
																	<label
																		htmlFor='contact_details'
																		className='text-gray-600 capitalize text-sm'>
																		Contact Details
																		<span className='text-medium leading-12 font-semibold'>
																			{' '}
																			*
																		</span>
																	</label>
																	<input
																		required
																		type='text'
																		name='contact_details'
																		// value={x.contactDetails}
																		onChange={ev => {
																			handleOnChange(
																				ev
																			)
																		}}
																		value={userData['contact_details']?.value || ''}
																		className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																	/>
																</div>

														    </div>
															})
															: <h4>No Contacts Assigned to User</h4>
															}

														</div>
														<div class="sticky top-0 right-10 w-full flex justify-end">
															<button className='rounded bg-green-600 p-2 text-white flex text-md font-semibold '
																onClick={() => {handleAddClick()}} 
																>
																	{`Add Contact`}
																	<PlusIcon className='text-white ml-2 h-5 w-5'/>
															</button>

														</div>

														{/* Group Details */}
														<div className=' w-full flex flex-col items-start justify-start p-3 rounded border border-gray-300/70 bg-gray-50 h-auto'>
															<h4 className='text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900'>
																Group
															</h4>
															 <div className='w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3'>
																<div className='w-full flex flex-col items-left px-2 justify-  gap-1 gap-x-3 mb-3'>
																<Select
																options={
																	Array.from(groups || [],
																		fltopt => {
																			return {
																				value: fltopt.id, label: fltopt.name
																			}
																		})
																}
																required
																isMulti
																placeholder='Select group(s)'
																name='group'
																onChange={ev => {
																	handleOnChange(
																		{
																			group:ev
																		}
																	)
																}}
																value={userData['group']?.value.map((value) => ({ 
																	value: value.value,
																	label: value.label 
																  })) || ''}
																className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
															    />
																</div>	
																
														    </div>
														
														</div>

														{selectedGroups.map((grp)=>{
															return (
																<>
																{(()=>{
																	if(grp.id==1 || grp.id== 12|| grp.id ==2){
																		return(
																			// Administrative area 
																		<div className=' w-full flex flex-col items-start justify-start p-3 rounded border border-gray-300/70 bg-gray-50 h-auto'>
																			<h4 className='text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900'>
																				Administrative Areas
																			</h4>
																			<div className='w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3'>
																				<div className='w-full flex flex-col items-left px-2 justify-  gap-1 gap-x-3 mb-3'>
																					
																					<Select
																					options={
																						Array.from(counties || [],
																							fltopt => {
																								return {
																									value: fltopt.id, label: fltopt.name
																								}
																							})
																					}
																					isMulti
																					required
																					placeholder='Select county..'
																					onChange={ev => {
																						handleSubCounties(ev)
																						handleOnChange(
																							ev
																						)
																					}}
																					value={userData['county']?.value || ''}
																					name='county'
																					className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
																					/>
																					<Select
																					options={
																						Array.from(subCountyOptions || [],
																							fltopt => {
																								return {
																									value: fltopt.value, label: fltopt.label
																								}
																							})
																					}
																					isMulti
																					required
																					placeholder='Select a sub county..'
																					onChange={ev => {
																						handleOnChange(
																							ev
																						)
																					}}
																					value={userData['subcounty']?.value || ''}
																					name='subcounty'
																					className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
																					/>
																				</div>	
																				
																			</div>
																			
																		</div>)
																	} 
																	else if(grp.id==3){
																		return (
																			//  Regulatory body 
																			<div className=' w-full flex flex-col items-start justify-start p-3 rounded border border-gray-300/70 bg-gray-50 h-auto'>
																				<h4 className='text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900'>
																					Regulatory Body
																				</h4>
																				<div className='w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3'>
																					<div className='w-full flex flex-col items-left px-2 justify-  gap-1 gap-x-3 mb-3'>
																						
																						<Select
																						options={
																							Array.from(regbodies || [],
																								fltopt => {
																									return {
																										value: fltopt.id, label: fltopt.name
																									}
																								})
																						}
																						isMulti
																						required
																						placeholder='Select regulatory body(s)'
																						onChange={ev => {
																							handleOnChange({
																								regulatory_body: ev
																							})
																						}}
																						value={userData['regulatory_body']?.value.map((value) => ({ 
																							value: value.value,
																							label: value.label 
																						  })) || ''}
																						name='regulatory_body'
																						className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
																						/>
																					</div>	
																					
																				</div>
																				
																			</div>
																		)
																	}
																	else {
																		return null
																	}
																})()}
																</>
															)	
														})}
 
														{/* Cancel & Save */}
														<div className='flex justify-between items-center w-full'>
															<button className='flex items-center justify-start space-x-2 p-1 border-2 border-black rounded px-2'>
																<ChevronDoubleLeftIcon className='w-4 h-4 text-black' />
																<span className='text-medium font-semibold text-black '>
																	Cancel
																</span>
															</button>
															<button
																type='submit'
																className='rounded bg-green-600 p-2 text-white flex text-md font-semibold '>
																<span className='text-medium font-semibold text-white'>
																	Save
																</span>
															</button>
														</div>
													</form>
												</>
											{/* ); */}
									
                                      

                             
                            </div>
                        </div>
                        

                    </div>
                    
                    <aside className="flex flex-col col-span-5 md:col-span-1 p-1 md:h-full">
                        <details className="rounded bg-transparent py-2 text-basez flex flex-col w-full md:stickyz md:top-2z" open>
                          
                        </details>
                    </aside>
                    {/* (((((( Floating div at bottom right of page */}
                    <div className="fixed bottom-4 right-4 z-10 w-96 h-auto bg-yellow-50/50 bg-blend-lighten shadow-lg rounded-lg flex flex-col justify-center items-center py-2 px-3">
                        <h5 className="text-sm font-bold">
                            <span className="text-gray-600 uppercase">Limited results</span>
                        </h5>
                        <p className="text-sm text-gray-800">
                            For testing reasons, downloads are limited to the first 100 results.
                        </p>
                    </div>
                    {/* ))))))) */}
                </div>
    </MainLayout>
  )
}

AddUser.getInitialProps = async (ctx) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
	//groups counties/?page_size=500&ordering=name
	const fetchGroups = token => {
        let filters_url = API_URL + '/users/groups?ordering=name&page_size=100'
        return fetch(filters_url, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json'
            }
        }).then(r => r.json())
            .then(json => {
                return json
            }).catch(err => {
                console.log('Error fetching groups: ', err)
                return {
                    error: true,
                    err: err,
                    filters: []
                }
            })
    }
	//contact types
	const fetchContactType = token => {
        let filters_url = API_URL + '/common/contact_types/?fields=id,name'
        return fetch(filters_url, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json'
            }
        }).then(r => r.json())
            .then(json => {
                return json
            }).catch(err => {
                console.log('Error fetching contact types: ', err)
                return {
                    error: true,
                    err: err,
                    filters: []
                }
            })
    }
	// counties 
	const fetchCounties = token => {
        let filters_url = API_URL + '/common/counties/?page_size=500&ordering=name'
        return fetch(filters_url, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json'
            }
        }).then(r => r.json())
            .then(json => {
                return json
            }).catch(err => {
                console.log('Error fetching counties: ', err)
                return {
                    error: true,
                    err: err,
                    filters: []
                }
            })
    } 

	// counties 
	const fetchRegulatingBodies = token => {
		let filters_url = API_URL + '/facilities/regulating_bodies/'
		return fetch(filters_url, {
			headers: {
				'Authorization': 'Bearer ' + token,
				'Accept': 'application/json'
			}
		}).then(r => r.json())
			.then(json => {
				return json
			}).catch(err => {
				console.log('Error fetching regulating bodies: ', err)
				return {
					error: true,
					err: err,
					filters: []
				}
			})
	}

	//job titles
	const fetchData = async (token) => {
		 let url = API_URL + '/facilities/job_titles/'
		 const all = await Promise.all([
			fetchContactType(token),
			fetchGroups(token),
			fetchCounties(token),
			fetchRegulatingBodies(token)
		  ]);
		  const paths = all.map(a => ({params: a}))
		  let query = { 'searchTerm': '' }
		  if (ctx?.query?.qf) {
			  query.qf = ctx.query.qf
		  }
		  if (ctx?.query?.q) {
			  query.searchTerm = ctx.query.q
			  url += `&search={"query":{"query_string":{"default_field":"name","query":"${query.searchTerm}"}}}`
		  }
		  
		  let current_url = url + '&page_size=100000'
		  if (ctx?.query?.page) {
			  console.log({page:ctx.query.page})
			//   url = `${url}&page=${ctx.query.page}`
		  }
		  // console.log('running fetchData(' + url + ')')
		  return fetch(url, {
			  headers: {
				  'Authorization': 'Bearer ' + token,
				  'Accept': 'application/json'
			  }
		  }).then(r => r.json())
			  .then(json => {
					return {
						data: json, query, token, filters: { ...paths }, path: ctx.asPath || '/add_user', current_url: current_url 
					}
				  
			  }).catch(err => {
				  console.log('Error fetching job titles: ', err)
				  return {
					  error: true,
					  err: err,
					  data: [],
					  query: {},
					  path: ctx.asPath || '/users',
					  current_url: ''
				  }
			  })
	  }
  
	  return checkToken(ctx.req, ctx.res).then(t => {
		  if (t.error) {
			  throw new Error('Error checking token')
		  } else {
			  let token = t.token
			  return fetchData(token).then(t => t)
		  }
	  }).catch(err => {
		  console.log('Error checking token: ', err)
		  if (typeof window !== 'undefined' && window) {
			  if (ctx?.asPath) {
				  window.location.href = ctx?.asPath
			  } else {
				  window.location.href = '/add_user'
			  }
		  }
		  setTimeout(() => {
			  return {
				  error: true,
				  err: err,
				  data: [],
				  query: {},
				  path: ctx.asPath || '/add_user',
				  current_url: ''
			  }
		  }, 1000);
	  })
  
}
  
  export default AddUser