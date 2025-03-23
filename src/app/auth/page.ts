
import { redirect } from 'next/navigation'

function Page() {
  redirect("/auth/login")
}

export default Page