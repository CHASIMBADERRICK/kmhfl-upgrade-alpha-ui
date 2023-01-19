
import { useRef } from "react"
import { XCircleIcon } from '@heroicons/react/outline'
import Select from 'react-select'

const FacilityDeptRegulationFactory = ({facilityDeptOptions, facilityDepts, setFacilityDepts, setIsRegBodyChange, isRegBodyChange, index}) => {

    const regBodyRef = useRef(null)
    return (
        <div className="w-full flex items-center justify-between gap-3 mt-3">            
            {/* Name */}
            <Select options={facilityDeptOptions || []} 
                required
                placeholder="Select Name"
                onChange={
                    e => {
                        if(regBodyRef.current){
                        
                            regBodyRef.current.value = facilityDeptOptions.filter(({label}) => label === e.label)[0].reg_body_name
                        }
                    }
                }
                name="facility_dept_name" 
                className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
            
            {/* Regulatory Body */}
            <input type="text" disabled ref={regBodyRef} name="facility_regulatory_body" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />

            {/* License No. */}
            <input type="text" name="facility_license_number" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />

            <div className='flex items-center space-x-2 w-full'>
                {/* Reg No. */}
                <input type="text" name="facility_registration_number" className="flex-none  bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
            
                {/* Delete Btn */}
                <button onClick={ev => {
                     ev.preventDefault();
                    let depts = facilityDepts;
                    depts.splice(1, index);
                    setFacilityDepts(depts);
                    setIsRegBodyChange(!isRegBodyChange);


                }}><XCircleIcon className='w-7 h-7 text-red-400'/></button>
            </div>        
            
        </div>
    )
}

export default FacilityDeptRegulationFactory