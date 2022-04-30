
import React, {useState, useEffect} from "react"
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

interface Props {
	children: React.ReactNode;

}
export const IsAuthenticated:React.FC<Props> = ({children}) => {
	const router = useRouter()
	const [loading,setLoading] = useState(true);
	const cookieAddress = !Cookies.get("user_id") || Cookies.get("user_id") === "null" ? undefined : Cookies.get("user_id");
	useEffect(() => {
		if(!cookieAddress) {
			router.push("/registration")
		} else {
			setLoading(false)
		}
	},[])
	if(loading) {
		return <div></div>
	}
	return (
		<>
			{children}
		</>
	)

}