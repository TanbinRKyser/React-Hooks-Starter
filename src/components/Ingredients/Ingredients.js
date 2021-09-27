import React, { useReducer, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from '../Ingredients/IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';


const ingredientReducer = ( currentIngredients, action ) => {
  switch( action.type ){
    case 'SET':
      return action.ingredients;
    case 'ADD': 
      return [ ...currentIngredients, action.ingredients ];
    case 'DELETE':
      return currentIngredients.filter( ing => ing.id !== action.id );
    default:
      return currentIngredients;
  }
}

const httpReducer = ( httpState, action ) => {
  switch( action.type ){
    case 'SEND':
      return { loading: true, error: null };
    case 'RESPONSE':
      return { ...httpState, loading: false };
    case 'ERROR':
      return { loading: false, error: action.errorMessage };
    case 'CLEAR':
      return { ...httpState, error: null }
    default: return httpState;
  }
}


function Ingredients() {

  const [ ingredients, dispatchIngredients ] = useReducer( ingredientReducer, []);
  const [ httpState, dispatchHttp ] = useReducer( httpReducer, { loading: false, error: null } );

  const baseURL = 'URL';

  useEffect( () => {
    console.log( "RENDERING", ingredients )
  }, [ ingredients ]);


  // Getting data from IngredientForm and adding it current list of ingredients.
  const addIngredientHandler = ingredient => {

    dispatchHttp({ type: 'SEND' });

    fetch( baseURL + '/ingredients.json', {
      method: 'POST',
      body: JSON.stringify( ingredient ),
      headers: {
        'Content-Type' : 'application/JSON'
      }
    }).then( response => {
      dispatchHttp({ type: 'RESPONSE' });
      return response.json();
    }).then( 
      data => {
        dispatchIngredients({ type: 'ADD', ingredients: { 
                                id: data.name, 
                                ...ingredient } 
        })
    });
  }

  // Remove Data
  const removeIngredientHandler = ingredientId => {
    dispatchHttp({ type: 'SEND' });

    fetch( baseURL + `/ingredients/${ ingredientId }.json`, {
              method: 'DELETE'
    }).then( response => {
        dispatchHttp({ type: 'RESPONSE' });
        dispatchIngredients({ type: 'DELETE',  id: ingredientId });
    }).catch( error => {
        dispatchHttp({ type: 'ERROR', errorMessage: error.message });
    });
  }

  // GET data
  const filteredIngredientsHandler = useCallback( filteredIngredients  => {
    dispatchIngredients({ type: 'SET', ingredients: filteredIngredients });
  }, [] );

  const clearError = () => {

    dispatchHttp({ type: 'CLEAR' });
  }

  return (
    <div className="App">

      { httpState.error 
          ? <ErrorModal onClose={ clearError }>{ httpState.error }</ErrorModal> 
          : null }

      <IngredientForm 
        addIngredient = { addIngredientHandler }
        loading = { httpState.loading } />

      <section>
        <Search onLoadIngredients={ filteredIngredientsHandler }  />
        
        <IngredientList
          ingredients={ ingredients }
          onRemoveItem={ removeIngredientHandler }  />
      </section>
    </div>
  );
}

export default Ingredients;
