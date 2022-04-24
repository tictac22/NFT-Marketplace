
import React, { useContext,useState } from "react"
import { useRouter } from 'next/router';

interface IContext {
	status:boolean,
	currency:string,
	min:string,
	max:string,
}
const Context = React.createContext<IContext>(null)

export const useQueryParams = () => {
	return useContext(Context);
}

interface Props {
	children:React.ReactNode
}
export const FilterContext:React.FC<Props> = ({children}) => {
	const {query} = useRouter();

	const status = JSON.parse(query.status ?? "null");
	const currency = query.currency || "Polygon"
	const min = query.min || null
	const max = query.max || null
	return (
		<Context.Provider value={{status,currency,min,max}}>
			{children}
		</Context.Provider>
	)
}