import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { LicenseManager } from '@ag-grid-enterprise/core';


const Resources = () => {
    // require('ag-grid-enterprise')
    LicenseManager.setLicenseKey("test");
    const router = useRouter()

	const [openHFR, setOpenHFR] = useState(false);
    const [openAdmin, setOpenAdmin] = useState(false);
    const [openCHUs, setOpenCHUs] = useState(false);

	const handleHFRUnitsClick = () => {
		setOpenHFR(!openHFR);
	}
    const handleAdminClick = () => {
		setOpenAdmin(!openAdmin);
	}
    const handleCHUClick = () => {
		setOpenCHUs(!openCHUs);
	}


    return (
    <div className='col-span-1 w-full col-start-1 h-auto border-r-2 border-gray-300'>
        
       
            {/* Health Facility Reports*/}
           
                 <List
                    sx={{ width: '100%', bgcolor: 'background.paper', flexGrow:1 }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                        <ListSubheader component="div" id="nested-list-subheader">
                                Health Facility Reports
                        </ListSubheader>
                    }
                  >	
                
                    <ListItemButton sx={{ ml: 8 }} onClick={()=>{router.push('/reports/static_reports') }}>
                        <ListItemText primary="Beds and Cots" />
                    </ListItemButton>
                    <ListItemButton sx={{ ml: 8 }} onClick={()=>{router.push('/reports/facilities_count') }}>
                        <ListItemText primary="Facilities Count" />
                    </ListItemButton>
                
                    <ListItemButton sx={{ ml: 8 }} onClick={()=>{router.push('/reports/facilities_by_owners') }}>
                        <ListItemText primary="Facilities by Owners" />
                    </ListItemButton>

                    <ListItemButton sx={{ ml: 8 }} onClick={()=>{router.push('/reports/facilities_by_owner_categories')}}>
                        <ListItemText primary="Facilities by Owner Categories" />
                    </ListItemButton>
                    <ListItemButton sx={{ ml: 8 }} onClick={()=>{router.push('/reports/facilities_by_type') }}>
                        <ListItemText primary="Facilities by Facility Type" />
                    </ListItemButton>

                    <ListItemButton sx={{ ml: 8 }} onClick={()=>{router.push('/reports/facilities_by_keph_levels')}}>
                        <ListItemText primary="Keph Levels" />
                    </ListItemButton>
                    <ListItemButton sx={{ ml: 8 }} onClick={()=>{router.push('/reports/facility_coordinates')}}>
                        <ListItemText primary="Facility Coordinates" />
                    </ListItemButton>

                    <ListItemButton sx={{ ml: 8 }} onClick={()=>{router.push('/reports/officers_in_charge')}}>
                        <ListItemText primary="Officers In-charge" />
                    </ListItemButton>
                </List>
            

            {/* Administrative Offices*/}
            
                <List
                sx={{ width: '100%', bgcolor: 'background.paper', flexGrow:1 }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        Administrative Offices
                    </ListSubheader>
                }
                >	
                    <ListItemButton sx={{ ml: 8 }} onClick={()=>{router.push('/reports/admin_offices') }}>
                        <ListItemText primary="Admin Offices" />
                    </ListItemButton>
                    
                </List>
          
            
                {/* Community Health Units*/}
                <List
                sx={{ width: '100%', bgcolor: 'background.paper', flexGrow:1 }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                    Community Health Units                    
                    </ListSubheader>
                }
                >	
                    
                    <ListItemButton sx={{ ml: 8 }} onClick={()=>{router.push('/reports/chus_count')}}>
                        <ListItemText primary="Community Health Units Count" />
                    </ListItemButton>
                    <ListItemButton sx={{ ml: 8 }} onClick={()=>{router.push('/reports/chus_status')}}>
                        <ListItemText primary="Community Health Units (Status)" />
                    </ListItemButton>
                </List>
            
        
    </div>
    )
}   


export default Resources