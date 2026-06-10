import React from 'react'
import EmployerProfile from '@/src/components/employer/EmployerProfile'
import { getCurrentUser } from '@/src/helper/getCurrentUser'
import { getEmployerProfileAction } from '@/src/lib/actions/employerProfileActions'

const page = async () => {
  return (
    <div>
      <EmployerProfile user={await getCurrentUser()} employer={await getEmployerProfileAction()} />
    </div>
  )
}

export default page