import Link from 'next/link'
import { useRouter } from 'next/router'
import { ChevronDownIcon, ExternalLinkIcon, MenuAlt1Icon, SearchIcon } from '@heroicons/react/solid';
import { UserCircleIcon } from '@heroicons/react/outline';
import React, { useState, useEffect, useCallback } from 'react';
import { Menu } from '@headlessui/react'
import { getUserDetails } from '../controllers/auth/auth'
import LoadingAnimation from './LoadingAnimation';
import HeaderLayout from './HeaderLayout';

const DelayedLoginButton = () => {
    const [delayed, setDelayed] = useState(false)
    useEffect(() => {
        let mtd = true
        setTimeout(() => {
            if (mtd === true) {
                setDelayed(true)
            }
        }, 1000)
        return () => { mtd = false }
    }, [])
    if (delayed === true) {
        return <a href="/auth/login" className="bg-black hover:bg-green-700 focus:bg-green-700 active:bg-green-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white px-4 md:px-8 whitespace-nowrap py-2 rounded text-base font-semibold">Log in</a>
    } else {
        return <div className="p-3 w-16"> <LoadingAnimation size={6} /> </div>
    }
}

export default function MainLayout({ children, isLoading, searchTerm, isFullWidth, classes }) {
    const router = useRouter()
    const activeClasses = "text-black hover:text-gray-700 focus:text-gray-700 active:text-gray-700 font-medium border-b-2 border-green-600"
    const inactiveClasses = "text-gray-700 hover:text-black focus:text-black active:text-black"
    const currentPath = router.asPath.split('?', 1)[0]
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState(null)
<<<<<<< HEAD

    let API_URL = process.env.API_URL || 'http://localhost:8000/api'

    console.log("from MainLayout.js", {API_URL})
=======
    let API_URL = process.env.NEXT_PUBLIC_API_URL
>>>>>>> a384825142249647feedbad7e4573c14c33531c6
    if(typeof window !== 'undefined' && window.location.hostname === '127.0.0.1') {
        API_URL = 'http://localhost:8000/api'
    }

    //check if a session cookie is set
    let path = router.asPath
    if (path.includes('facilities') || path.includes('facility')) {
        path = '/facilities'
    } else if (path.includes('community')) {
        path = '/community-units'
    } else {
        path = '/facilities'
    }
    // console.log('path::: ', path)

    useEffect(() => {
        let mtd = true
        if (mtd) {
            let is_user_logged_in = (typeof window !== 'undefined' && window.document.cookie.indexOf('access_token=') > -1) || false
            setIsLoggedIn(is_user_logged_in)
            let session_token = null
            if (is_user_logged_in) {
                session_token = JSON.parse(window.document.cookie.split('access_token=')[1].split(';')[0])
            }

            if (is_user_logged_in && typeof window !== 'undefined' && session_token !== null) {
                console.log('active session found')
                // getUserDetails(session_token.token, API_URL + '/rest-auth/user/').then(usr=>{
                getUserDetails(session_token.token, API_URL + '/rest-auth/user/').then(usr => {
                    if (usr.error || usr.detail) {
                        setIsLoggedIn(false)
                        setUser(null)
                    } else {
                        setIsLoggedIn(true)
                        setUser(usr)
                    }
                })
            } else {
                console.log('no session. Refreshing...')
                // router.push('/auth/login')
            }
        }
        return () => { mtd = false }
    }, [])


    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen">
            <div className="w-full border-b border-gray-100 shadow-sm flex items-center justify-center lg:sticky lg:top-0 bg-white z-30">
                <HeaderLayout>

                </HeaderLayout>
                
            </div>
            <div className={"min-h-screen w-full flex flex-col items-center " + (isFullWidth ? "" : "max-w-screen-2xl") + (classes && classes.length > 0 ? classes.join(" ") : "")}>
                <>
                    {isLoading ? <div className="absolute inset-0 overflow-hidden bg-white opacity-90 z-20 flex items-center justify-center h-full">
                        <h3 className="text-2xl text-gray-800 font-bold">Loading...</h3>
                    </div> : children}
                </>
            </div>
            <footer className="bg-black py-5 items-center justify-center flex flex-wrap gap-y-3 gap-x-4 text-gray-300 text-sm w-full">
                <p>KMHFL V3 Beta</p>
                <span className="text-lg text-gray-400">&middot;</span>
                <a className="text-green-300 hover:underline focus:underline active:underline hover:text-white focus:text-white active:text-white" href="https://health.go.ke" target="_blank" rel="noreferrer noopener">Ministry of Health</a>
                <span className="text-lg text-gray-400">&middot;</span>
                <a className="text-green-300 hover:underline focus:underline active:underline hover:text-white focus:text-white active:text-white" href="https://healthit.uonbi.ac.ke" target="_blank" rel="noreferrer noopener">USAID HealthIT</a>
                <span className="text-lg text-gray-400">&middot;</span>
                <a className="text-green-300 hover:underline focus:underline active:underline hover:text-white focus:text-white active:text-white" href="http://kmhfl.health.go.ke" target="_blank" rel="noreferrer noopener">KMHFL v2</a>
            </footer>
        </div>
    );
}