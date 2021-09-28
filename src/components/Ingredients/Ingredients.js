import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from '../Ingredients/IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';
import  useHttp  from '../../hooks/http';

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


function Ingredients() {

  const [ ingredients, dispatchIngredients ] = useReducer( ingredientReducer, []);
  const { loading, error, data, param, identifier, sendRequest, clearAll } = useHttp();

  const baseURL = 'URL';


  useEffect( () => {
    if( !loading && !error && identifier === 'DELETE_INGREDIENT' ){
      dispatchIngredients({ type: 'DELETE', id: param });
    } else if( !loading && !error && identifier === 'ADD_INGREDIENT' ){
      dispatchIngredients({ 
        type: 'ADD', 
        ingredients: { 
          id: data.name, 
          ...param } 
      });
    }
  }, [ data, param, identifier, loading, error ]);

   // METHOD
  // GET data
  const filteredIngredientsHandler = useCallback( filteredIngredients  => {
    dispatchIngredients({ type: 'SET', ingredients: filteredIngredients });
  }, [] );

  // METHOD
  // Getting data from IngredientForm and adding it current list of ingredients.
  const addIngredientHandler = useCallback( ingredient => {
    sendRequest( baseURL + '/ingredients.json', 
      'POST',
      JSON.stringify( ingredient ),
      ingredient,
      'ADD_INGREDIENT'
    );
  }, [ sendRequest ]);

  // METHOD
  // Remove Data
  const removeIngredientHandler = useCallback( ingredientId => {
    sendRequest( baseURL + `/ingredients/${ingredientId}.json`, 
      'DELETE',
      null,
      ingredientId,
      'DELETE_INGREDIENT'
    );
  }, [ sendRequest ]);

  // METHOD
  // Memorising the component via useMemo()
  const ingredientList = useMemo( () => {
    return <IngredientList
              ingredients={ ingredients }
              onRemoveItem={ removeIngredientHandler }  />
  }, [ ingredients, removeIngredientHandler ]);


  return (
    <div className="App">

      { error ? <ErrorModal onClose={ clearAll }>{ error }</ErrorModal> : null }

      <IngredientForm 
        addIngredient = { addIngredientHandler }
        loading = { loading } />

      <section>
        <Search onLoadIngredients={ filteredIngredientsHandler }  />
        
        { ingredientList }
      </section>
    </div>
  );
}

export default Ingredients;
