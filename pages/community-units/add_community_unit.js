// React imports
import React, { useState, useEffect, useRef } from 'react';

// Next imports
import Head from 'next/head';

// Component imports
import MainLayout from '../../components/MainLayout';
import TrasnferListServices from '../../components/TrasnferListServices';
import { renderMenuItem } from '../../components/renderMenuItem';

// Controller imports
import { checkToken } from '../../controllers/auth/auth';

// MUI imports
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { FixedSizeList } from 'react-window';


// Heroicons imports
import {
	ChevronDoubleRightIcon,
	ChevronDoubleLeftIcon,

	TrashIcon
} from '@heroicons/react/solid';


// Package imports
import Select from 'react-select';


function AddCommUnit(props) {

	const facilities = props.facility_data.results;
	const serviceCtg = props.service_categories.results;

	// Reference hooks for the services section
	const nameOptionRef = useRef();
	const serviceCategoriesRef = useRef();
	const optionRefBody = useRef();

	const [selected_facility, setSelectedFacility] = useState(null);
	const [countyValue, setCountyValue] = useState('');
	const [subCountyValue, setSubCountyValue] = useState('');
	const [constituencyValue, setConstituencyValue] = useState('');
	const [wardValue, setWardValue] = useState('');
	const [chulId, setchulId] = useState('');

	// Services state
	const [services, setServices] = useState([])
	const [refreshForm, setRefreshForm] = useState(false)


	// Define registration steps
	const steps = [
		'Basic Details',
		'CHEWS: Community Health Extension Workers',
		'Services',
	];

	// Define serviceCategories
	let serviceCategories = ((_services) => {
		
		const _serviceCategories = []
		let _values = []
		let _subCtgs = []

		if(_services.length > 0){
			_services.forEach(({name:ctg}) => {
				let allOccurences = _services.filter(({name}) => name === ctg)
				
				allOccurences.forEach(({id, description}) => {
					_subCtgs.push(description)
					_values.push(id)
				})
				
				if(_serviceCategories.map(({name}) => name).indexOf(ctg) === -1){
					_serviceCategories.push({
						name: ctg,
						subCategories:_subCtgs,
						value:_values
					})
				}
				
				_values = []
				_subCtgs = []
	
			})
		}
		
		return _serviceCategories
	 })(props.service_categories.results ?? [])

	// Define state
	const [formId, setFormId] = useState(0);

	// Define useEffect
	useEffect(() => {
		const formIdState = window.sessionStorage.getItem('formId');

		if (formIdState == undefined || formIdState == null || formIdState == '') {
			window.sessionStorage.setItem('formId', 1);
		}
		// console.log(formId);

		setFormId(window.sessionStorage.getItem('formId'));

		return () => {
			if (window.sessionStorage.getItem('formId') == '3') {
				window.sessionStorage.setItem('formId', 0);
			}
		};
	}, [formId, facilities, serviceCtg]);
	// console.log(formId);

	return (
		<>
			{/* Head */}
			<Head>
				<title> KMFHL - Add Community Unit</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			{/* Main Layout */}
			<MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>
				<div className='w-full grid grid-cols-5 gap-4 px-1 md:px-4 py-2 my-4'>
					{/* Breadcrumbs */}
					<div className='col-span-5 flex flex-col gap-3 md:gap-5 px-4'>
						<div className='flex flex-wrap items-center justify-between gap-2 text-sm md:text-base py-3'>
							<div className='flex flex-row items-center justify-between gap-2 text-sm md:text-base py-3'>
								<a className='text-green-800' href='/'>
									Home
								</a>{' '}
								{'>'}
								<a className='text-green-800' href='/community-units'>
									Community Units
								</a>{' '}
								{'>'}
								<span className='text-gray-500'>Add Community Unit</span>
							</div>
							<div className='flex flex-wrap items-center justify-evenly gap-x-3 gap-y-2 text-sm md:text-base py-3'></div>
						</div>
					</div>

					{/* Stepper and Form */}
					<div className='col-span-5 md:col-span-4 flex flex-col items-center border rounded pt-8 pb-4 gap-4 mt-2 order-last md:order-none'>
						{/* Stepper Header */}
						<div className='flex flex-col justify-center items-center px-1 md:px-4 w-full '>
							<Box sx={{ width: '100%' }}>
								<Stepper activeStep={parseInt(formId)} alternativeLabel>
									{steps.map((label) => (
										<Step key={label}>
											<StepLabel>{label}</StepLabel>
										</Step>
									))}
								</Stepper>
							</Box>
						</div>

						{/* Stepper Body */}
						<div className='flex flex-col justify-center items-start px-1 md:px-4 w-full '>
							<div
								className=' w-full flex flex-col items-start justify-start p-3 rounded border border-gray-300/70 bg-gray-50'
								style={{ minHeight: '250px' }}>
								{/* Form-changing switch statement */}
								{(() => {
									switch (parseInt(formId)) {
										// Basic Details Case
										case 0:
											const handleBasicDetailsSubmit = (event) => {
												event.preventDefault();

												let _id;

												// An empty object of the form data
												const formData = {};

												// Loop through all the form elements and add them to the object
												const elements = [...event.target];

												elements.forEach(({ name, value }) => {
													formData[name] = value;
												});
												console.log(formData);

												// Posting CHU basic details 
												try {
													fetch('/api/common/submit_form_data/?path=CHUs', {
														headers: {
															'Accept': 'application/json, text/plain, */*',
															'Content-Type': 'application/json;charset=utf-8'

														},
														method: 'POST',
														body: JSON.stringify(formData).replace(',"":""', '')
													})

														.then(async (resp) => {
															const { id } = (await resp.json())
															_id = id;

															if (resp) {
																setchulId(_id) //setting the state to the current CHUL
															}
															console.log(_id);
														})
												}

												catch (e) {
													console.error('Unable to post basic details')
												}

												// Set the formId to the next step
												window.sessionStorage.setItem('formId', 1);

												// Redirect to the next page
												setFormId(window.sessionStorage.getItem('formId'));
											};
											// Basic Details Form
											return (
												<>
													<h4 className='text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900'>
														Community Health Unit Basic Details
													</h4>
													{/* Actual form */}
													<form
														className='flex flex-col w-full items-start justify-start gap-3'
														onSubmit={handleBasicDetailsSubmit}>

														{/* CHU name */}
														<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
															<label
																htmlFor='comm_unit_name'
																className='text-gray-600 capitalize text-sm'>
																Community Health Unit Name
																<span className='text-medium leading-12 font-semibold'>
																	{' '}
																	*
																</span>
															</label>
															<input

																type='text'
																name='name'
																className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
															/>
														</div>

														{/* CHU linked facility */}
														<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
															<label
																htmlFor='comm_unit_facility'
																className='text-gray-600 capitalize text-sm'>
																Community Health Unit Linked Facility
																<span className='text-medium leading-12 font-semibold'>
																	{' '}
																	*
																</span>
															</label>
															<Select
																onChange={(value) => {
																	setSelectedFacility(value);
																	
																	// list the facilities and their counties
																	facilities.map((facility) => {
																		if (facility.id === value.value) {
																			setCountyValue(facility.county);
																			setSubCountyValue(facility.sub_county_name);
																			setConstituencyValue(facility.constituency);
																			setWardValue(facility.ward_name);
																		}
																	}
																	);
																	console.log(countyValue);
																}}

																options={facilities.map((facility) => {
																	return {
																		value: facility.id,
																		label: facility.name,
																	};
																}
																)}

																placeholder='Select linked facility...'
																name='facility'
																className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
															/>
														</div>

														{/* CHU Status */}

														<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
															<label
																htmlFor="comm_unit_status"
																className='text-gray-600 capitalize text-sm'>
																Operation Status
																<span className='text-medium leading-12 font-semibold'>
																	{' '}
																	*
																</span>
															</label>

															<Select
																options={[
																	{
																		value: '2943e6c1-a581-461e-85a4-b9f25a2674ab',
																		label: 'Closed',
																	},
																	{
																		value: 'bac8ab50-1dad-4f96-ab96-a18a4e420871',
																		label: 'Non-functional',
																	},
																	{
																		value: 'fbc7fce5-3328-4dad-af70-0ec3d8f5ad80',
																		label: 'Semi-functional',
																	},
																	{
																		value: '50ef43f0-887c-44e2-9b09-cfa7a7090deb',
																		label: 'Fully-functional',
																	},
																]}
																required
																placeholder='Select an operation status ...'
																name='status'
																className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
															/>
														</div>

														{/* Date Established and Date Operational */}
														<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
															<div className='grid grid-cols-2 place-content-start gap-3 w-full'>
																{/* Date Established  */}
																<div className='col-start-1 col-span-1'>
																	<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																		<label
																			htmlFor='date_established'
																			className='text-gray-600 capitalize text-sm'>
																			Date Established
																			<span className='text-medium leading-12 font-semibold'>
																				{' '}
																				*
																			</span>
																		</label>
																		<input
																			required
																			type='date'
																			name='date_established'
																			className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																		/>
																	</div>
																</div>

																{/* Date Operational  */}
																<div className='col-span-1'>
																	<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																		<label
																			htmlFor='date_operational'
																			className='text-gray-600 capitalize text-sm'>
																			Date Operational
																			<span className='text-medium leading-12 font-semibold'>
																				{' '}
																				*
																			</span>
																		</label>
																		<input
																			required
																			type='date'
																			name='date_operational'
																			className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																		/>
																	</div>
																</div>
															</div>
														</div>

														{/* Number of Monitored Households */}
														<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
															<label
																htmlFor='no_monitored_households'
																className='text-gray-600 capitalize text-sm'>
																Number of monitored households
																<span className='text-medium leading-12 font-semibold'>
																	{' '}
																	*
																</span>
															</label>
															<input
																required
																type='number'
																name='no_monitored_households'
																placeholder='Number of households served by the unit'
																min={0}
																className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
															/>
														</div>

														{/* Number of CHVs */}
														<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
															<label
																htmlFor='no_chvs'
																className='text-gray-600 capitalize text-sm'>
																Number of CHVs
																<span className='text-medium leading-12 font-semibold'>
																	{' '}
																	*
																</span>
															</label>
															<input
																required
																type='number'
																name='no_chvs'
																placeholder='Number of Community Health Volunteers in the unit'
																min={0}
																className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
															/>
														</div>

														{/* Location */}
														<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
															<div className='grid grid-cols-4 place-content-start gap-3 w-full'>
																{/* County  */}
																<div className='col-start-1 col-span-1'>
																	<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																		<label
																			htmlFor='linked_facility_county'
																			className='text-gray-600 capitalize text-sm'>
																			County
																			<span className='text-medium leading-12 font-semibold'>
																				{' '}
																				*
																			</span>
																		</label>
																		<input
																			value={countyValue}
																			type='text'
																			name='linked_facility_county'
																			className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																		/>
																	</div>
																</div>

																{/* Sub-county */}
																<div className='col-start-2 col-span-1'>
																	<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																		<label
																			htmlFor='keph_level'
																			className='text-gray-600 capitalize text-sm'>
																			Sub-county
																			<span className='text-medium leading-12 font-semibold'>
																				{' '}
																				*
																			</span>
																		</label>
																		<input
																			value={subCountyValue}
																			type='text'
																			name='linked_facility_sub_county'
																			className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																		/>
																	</div>
																</div>

																{/* Constituency */}
																<div className='col-start-3 col-span-1'>
																	<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																		<label
																			htmlFor='keph_level'
																			className='text-gray-600 capitalize text-sm'>
																			Constituency
																			<span className='text-medium leading-12 font-semibold'>
																				{' '}
																				*
																			</span>
																		</label>
																		<input
																			value={constituencyValue}
																			type='text'
																			name='linked_facility_sub_county'
																			className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																		/>
																	</div>
																</div>

																{/* Ward */}
																<div className='col-start-4 col-span-1'>
																	<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
																		<label
																			htmlFor='keph_level'
																			className='text-gray-600 capitalize text-sm'>
																			Ward
																			<span className='text-medium leading-12 font-semibold'>
																				{' '}
																				*
																			</span>
																		</label>
																		<input
																			value={wardValue}
																			type='text'
																			name='linked_facility_sub_county'
																			className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																		/>
																	</div>
																</div>
															</div>
														</div>

														{/* Area of Coverage */}
														<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
															<label
																htmlFor='area_of_coverage'
																className='text-gray-600 capitalize text-sm'>
																Area of coverage
															</label>
															<input
																required
																type='number'
																name='area_of_coverage'
																placeholder='Description of the area of coverage'
																min={0}
																className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
															/>
														</div>

														{/* Cancel and CHEWs */}
														<div className='flex justify-between items-center w-full'>
															<button className='flex items-center justify-start space-x-2 p-1 bg-red-500 rounded px-2'>
																<ChevronDoubleLeftIcon className='w-4 h-4 text-white' />
																<span className='text-medium font-semibold text-white '>
																	Cancel
																</span>
															</button>
															<button
																type='submit'
																className='flex items-center justify-start space-x-2 bg-green-500 rounded p-1 px-2'>
																<span className='text-medium font-semibold text-white'>
																	CHEWs
																</span>
																<ChevronDoubleRightIcon className='w-4 h-4 text-white' />
															</button>
														</div>
													</form>
												</>
											);
										// CHEWs Case
										case 1:
											// Handle CHEWs Case
											const handleCHEWSubmit = (event) => {
												event.preventDefault();

												const ChewData = {};

												const elements = [...event.target];
												let payload = {}

												elements.forEach(({ name, value }) => {
													switch (name) {
														case 'first_name':
															ChewData[name] = value
															break;
														case 'last_name':
															ChewData[name] = value
															break;
														case 'is_incharge':
															ChewData[name] = value
															break;
													}
												});
												console.log(ChewData);

												payload = {
													health_unit_workers: [{
														first_name: ChewData.first_name,
														last_name: ChewData.last_name,
														is_incharge: true
													}]
												}

												console.log(payload);




												try {

													fetch(`/api/common/submit_form_data/?path=chul_data&id=${chulId}`, {

														headers: {
															'Accept': 'application/json, text/plain, */*',
															'Content-Type': 'application/json;charset=utf-8'

														},
														method: 'POST',
														body: JSON.stringify(payload)
													})
												}
												catch (e) {
													console.error('Unable to patch facility contacts details'.e.message)
												}


												window.sessionStorage.setItem('formId', 2);

												setFormId(window.sessionStorage.getItem('formId'));
											};

											const handleCHEWPrevious = (event) => {
												event.preventDefault();

												window.sessionStorage.setItem('formId', 0);

												console.log({ formId })

												setFormId(window.sessionStorage.getItem('formId'));
											};
											return (
												<>
													<h4 className='text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900'>
														CHEWs: Community Health Extension Workers
													</h4>
													<form
														name='chews_form'
														className='flex flex-col w-full items-start justify-start gap-3'
														onSubmit={handleCHEWSubmit}>
														<div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
															{/* Form labels */}
															<div className='grid grid-cols-4 place-content-start gap-3 w-full'>
																{/* First Name */}
																<div className='col-start-1 col-span-1'>
																	<label
																		htmlFor='first_name' start
																		className='block text-sm font-medium text-gray-700'>
																		First Name
																	</label>
																</div>
																{/* Second Name */}
																<div className='col-start-2 col-span-1'>
																	<label
																		htmlFor='last_name'
																		className='block text-sm font-medium text-gray-700'>
																		Second Name
																	</label>
																</div>
																{/* In charge */}
																<div className='col-start-3 col-span-1'>
																	<label
																		htmlFor='is_incharge'
																		className='block text-sm font-medium text-gray-700'>
																		In Charge
																	</label>
																</div>

																{/* Delete CHEW */}
																<div className='col-start-4 col-span-1'>
																	<label
																		htmlFor='delete'
																		className='block text-sm font-medium text-gray-700'>
																		Delete
																	</label>
																</div>
															</div>

															{/* Form input */}
															<div className='grid grid-cols-4 place-content-start gap-3 w-full'>
																{/* First Name */}
																<div className='col-span-1'>
																	<input
																		required
																		type='text'
																		name='first_name'
																		className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																	/>
																</div>
																{/* Second Name */}
																<div className='col-span-1'>
																	<input
																		required
																		type='text'
																		name='last_name'
																		className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
																	/>
																</div>
																{/* In charge */}
																<div className='col-span-1'>
																	<div className='flex items-center py-3'>
																		<input
																			name='is_incharge'
																			type='checkbox'
																			className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
																		/>
																	</div>
																</div>

																{/* Delete CHEW */}
																<div className='col-span-1'>
																	<div className='flex items-center'>
																		{/* insert red button for deleting */}
																		<button
																			name='delete'
																			type='button'
																			className='bg-transparent group hover:bg-red-500 text-red-700 font-semibold hover:text-white p-3 rounded border border-red-500 hover:border-transparent '
																			onClick={() => { }}>
																			<TrashIcon class="w-7 h-7 text-red-500 group-hover:text-white" />
																		</button>
																	</div>
																</div>
															</div>
														</div>

														{/* Basic Details and Services */}
														<div className='flex justify-between md:grid md:grid-cols-4 items-center w-full'>
															<button
																className='flex items-center md:col-start-1 justify-start md:w-36 space-x-2 p-1 border-2 border-black rounded px-2'
																onClick={handleCHEWPrevious}>
																<ChevronDoubleLeftIcon className='w-4 h-4 text-black' />
																<span className='text-medium font-semibold text-black '>
																	Basic Details
																</span>
															</button>
															<button
																type='submit'
																className='flex items-center md:col-start-4 justify-start md:w-36 space-x-2 bg-green-500 rounded p-1 px-2'>
																<span className='text-medium font-semibold text-white'>
																	Services
																</span>
																<ChevronDoubleRightIcon className='w-4 h-4 text-white' />
															</button>
														</div>
													</form>
												</>
											);
										// Services Case
										case 2:
											// Handle Service Form Submit
											const handleServiceSubmit = (event) => {
												event.preventDefault();

												const _payload = services.map(({value}) => ({service: value}))

												_payload.forEach(obj => obj['health_unit'] = chulId)
	
												try{
													fetch(`/api/common/submit_form_data/?path=chul_services&id=${chulId}`, {
														headers:{
															'Accept': 'application/json, text/plain, */*',
															'Content-Type': 'application/json;charset=utf-8'
															
														},
														method:'POST',
														body: JSON.stringify({services:_payload})
													})

												}
												catch(e){
													console.error('Unable to patch CHU service details'. e.message)
												}
												

												window.sessionStorage.setItem('formId', 3);

												setFormId(window.sessionStorage.getItem('formId'))
												setServices([])
											};

											const handleServicesPrevious = (event) => {
												event.preventDefault();

												window.sessionStorage.setItem('formId', 1);
												setFormId(window.sessionStorage.getItem('formId'));
											};

											return (
												<>
													<h4 className='text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900'>
														Services Offered
													</h4>

													<form
														name='chu_services_form'
														className='flex flex-col w-full items-start justify-start gap-3'
														onSubmit={handleServiceSubmit}>
														{/* Transfer list Container */}
														<div className='flex items-center w-full h-auto min-h-[300px]'>
															{/* serviceCategories.map(ctg => ctg.name) */}
															<TrasnferListServices
																categories={serviceCategories}
																setServices={setServices}
																setRefreshForm={setRefreshForm}
																refreshForm={refreshForm}
															/>
														</div>
																												
														{/* Service Category Table */}
														<table className='w-full  h-auto my-4'>
															<thead className='w-full'>
																<tr className='grid grid-cols-2 place-content-end border-b-4 border-gray-300'>
																	<td className='text-lg font-semibold text-indigo-900 '>Name</td>
																	<td className='text-lg font-semibold text-indigo-900 ml-12'>Service Option</td>
																</tr>
															</thead>
															<tbody ref={optionRefBody}>
																{
																	services.map(({subctg}) => subctg).map((service_categories, i) => (
																		<tr key={`${service_categories}_${i}`} className='grid grid-cols-2 place-content-end border-b-2 border-gray-300'>
																			<td ref={nameOptionRef}>{service_categories}</td>
																			<td ref={serviceCategoriesRef} className='ml-12 text-base'>Yes</td>
																		</tr>
																	))
																}															
															</tbody>
														</table>

														<div className='flex justify-between items-center w-full'>
															<button
																onClick={handleServicesPrevious}
																className='flex items-center justify-start space-x-2 p-1 border-2 border-black rounded px-2'>
																<ChevronDoubleLeftIcon className='w-4 h-4 text-black' />
																<span className='text-medium font-semibold text-black '>
																	CHEWs
																</span>
															</button>
															<button
																type='submit'
																
																className='flex items-center justify-start space-x-2 bg-green-500 rounded p-1 px-2'>
																<span className='text-medium font-semibold text-white'>
																	Save
																</span>
																<ChevronDoubleRightIcon className='w-4 h-4 text-white' />
															</button>
														</div>
													</form>
												</>
											);
									}
								})()}
							</div>
						</div>
					</div>

					{/* Aside */}
					<aside className='flex flex-col col-span-5 md:col-span-1 p-1 md:h-full'>
						<details
							title='Menu filters'
							className='rounded bg-transparent py-2 text-basez flex flex-col w-full md:stickyz md:top-2z'
							open>
							<Box
								sx={{ width: '100%', height: 400, maxWidth: 360, bgcolor: 'background.paper' }}
							>
								<FixedSizeList
									height={400}
									width={360}
									itemSize={46}
									itemCount={9}
									overscanCount={5}
								>
									{renderMenuItem}
								</FixedSizeList>
							</Box>
						</details>
					</aside>

					{/* (((((( Floating div at bottom right of page */}
					<div className='fixed bottom-4 right-4 z-10 w-96 h-auto bg-yellow-50/50 bg-blend-lighten shadow-lg rounded-lg flex flex-col justify-center items-center py-2 px-3'>
						<h5 className='text-sm font-bold'>
							<span className='text-gray-600 uppercase'>Limited results</span>
						</h5>
						<p className='text-sm text-gray-800'>
							For testing reasons, downloads are limited to the first 100
							results.
						</p>
					</div>
					{/* ))))))) */}
				</div>
			</MainLayout>
		</>
	);
}

AddCommUnit.getInitialProps = async (ctx) => {

	return checkToken(ctx.req, ctx.res)
		.then(async (t) => {
			if (t.error) {
				throw new Error('Error checking token');
			} else {
				let token = t.token;
				console.log('token', token);

				// Prefetch the facility data details
				let url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/?fields=id,name,county,sub_county_name,constituency,ward_name&page=1&page_size=500`;
				console.log('url', url);
				const response = await fetch(url, {
					headers: {
						Authorization: 'Bearer ' + token,
						Accept: 'application/json',
					},
				})

				let facility_data = await response.json();
				console.log(url)
				console.log(facility_data);

				if (facility_data.error) {
					throw new Error('Error fetching facility data');
					window.location.reload();
				}

				// Fetch the service options
				let service_url = `${process.env.NEXT_PUBLIC_API_URL}/chul/services/?page_size=100&ordering=name`;

				const service_response = await fetch(service_url,
					{
						headers: {
							Authorization: 'Bearer ' + token,
							Accept: 'application/json',
						},
					})

				let service_categories = await service_response.json();
				console.log('Service Categories', service_categories)

				if (service_categories.error){
					throw new Error('Error fetching the service categories');
				}

				return {
					token: token,
					facility_data: facility_data,
					service_categories: service_categories,
				};

			}
		})
		.catch((err) => {
			console.log('Error checking token: ' + err);
			if (typeof window !== 'undefined' && window) {
				if (ctx?.asPath) {
					window.location.href = ctx?.asPath;
				} else {
					window.location.href = '/facilities';
				}
			}
			setTimeout(() => {
				return {
					error: true,
					err: err,
					data: [],
				};
			}, 1000);
		});
};

export default AddCommUnit;
