import React from 'react'
import EmployerSetting from '@/src/components/employer/EmployerSetting'
import { getCurrentUser } from '@/src/helper/getCurrentUser'
import { getEmployerProfileAction } from '@/src/lib/actions/settingsAction'

const page = async () => {
  return (
    <div>
        <EmployerSetting user={await getCurrentUser()} employer={await getEmployerProfileAction()} />
    </div>
  )
}

export default page