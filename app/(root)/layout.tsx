import React from 'react'
import Sidebar from '@/components/shared/Sidebar'

function layout({ children } : { children: React.ReactNode }) {
  return (
    <main className='root'>
        <Sidebar />
        {/* <MobileSidebar /> */}
        
        <div className='root-container'>
            <div className='wrapper'>
                {children}
            </div>
        </div>
    </main>
  )
}

export default layout