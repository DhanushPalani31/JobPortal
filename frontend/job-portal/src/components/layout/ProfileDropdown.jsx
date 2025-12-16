import React from 'react'
import {ChevronDown} from "lucide-react"
import { useNavigate } from 'react-router-dom'


const ProfileDropdown = ({isOpen,
              onToggle,
              avatar,
              companyName,
              email,
              onLogout}) => {
            
    const navigate=useNavigate();
  return (
    <div className=''>
      <button
      onClick={onToggle}
      className=''
      >
        {
            avatar?(
                <img src={avatar} alt='Avatar' className='' />
            ):(
                <div className=''>
                     <span className=''>
                        {companyName.charAt(0).toUpperCase()}
                     </span>
                </div>
            )
        }
        <div className=''>
            <p className=''>{companyName}</p>
            <p className=''>Employer</p>
        </div>
        <ChevronDown className=''/>
      </button>
      {
        isOpen && (
            <div className=''>
                <div>
                <p className=''>{companyName}</p>
                <p className=''>{email}</p>
                </div>
                <a
                onClick={()=>navigate(userRole==="jobseeker"?"/profile":"/company-profile")} className=''
                >View Profile</a>
                <div className=''>
                    <a href="#" onClick={onLogout} className=''>
                        Sign out
                    </a>
                    </div>
                </div>
        )
      }
    </div>
  )
}

export default ProfileDropdown
