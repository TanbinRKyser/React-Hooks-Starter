import { useReducer, useCallback } from "react";

const initialState = { 
    loading: false, 
    error: null, 
    data: null, 
    param: null,
    identifier: null
};

const httpReducer = ( httpState, action ) => {
    switch( action.type ){
        case 'SEND':
            return { loading: true, error: null, data: null, param: null, identifier: action.identifier };
        case 'RESPONSE':
            return { ...httpState, loading: false, data: action.data, param: action.param };
        case 'ERROR':
            return { loading: false, error: action.errorMessage };
        case 'CLEAR':
            return initialState;
        default: 
            return httpState;
    }
}


const useHttp = () => {
    
    const [ httpState, dispatchHttp ] = useReducer( httpReducer, initialState );


    const clearAll = useCallback( () => {
        dispatchHttp({ type: 'CLEAR' });
    }, [] );

    const sendRequest = useCallback(( url, method, body, param, identifier ) => {
        
        dispatchHttp({ type: 'SEND', identifier: identifier });
        
        fetch( url, {
                method: method,
                body:body,
                headers:{
                    'Content-Type' : 'application/json'
                }
        }).then( response => {
            return response.json();
        }).then( data => { 
            dispatchHttp({ type: 'RESPONSE', data: data, param: param  })
        }).catch( error => {
            dispatchHttp({ type: 'ERROR', errorMessage: error.message });
        });
    }, [] );

    return {
        loading: httpState.loading,
        error: httpState.error,
        data: httpState.data,
        param: httpState.param,
        identifier: httpState.identifier,
        sendRequest: sendRequest,
        clearAll: clearAll
    }
}

export default useHttp;