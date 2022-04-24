
import {createContext, useContext} from "react";

interface ContextInterface {
	abi:object,
	marketAddress:string
}
export const Context = createContext<ContextInterface>({abi:{},marketAddress:""});
export const useContract = () => {
	return useContext(Context);
}