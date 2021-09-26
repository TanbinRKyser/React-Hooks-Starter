import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from '../Ingredients/IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

function Ingredients() {

  const baseURL = 'URL';
  const [ ingredients, setIngredients ] = useState([]);
  const [ isLoading, setIsLoading ] = useState( false );
  const [ error, setError ] = useState( );

  useEffect( () => {
    console.log( "RENDERING", ingredients )
  }, [ ingredients ]);


  // Getting data from IngredientForm and adding it current list of ingredients.
  const addIngredientHandler = ingredient => {
    setIsLoading( true );
    // FetchAPI is JS function.
    fetch( baseURL + '/ingredients.json', {
      // default method in firebase is GET
              method: 'POST',
              body: JSON.stringify( ingredient ),
              headers: {
                'Content-Type' : 'application/JSON'
              }
    }).then( response => {
      setIsLoading( false );
      // Converting the response into a json.
      return response.json();
    }).then( 
          // data is basically data = response.json();
          data => {
              setIngredients( prevIngredients => [ 
                ...prevIngredients, { 
                  // data.name -> name prop returned from firebase, not by author/react.
                  id: data.name, 
                  ...ingredient 
                } ] 
              );
    });
  }

  const removeIngredientHandler = ingredientId => {
    
    setIsLoading( true );
    
    fetch( baseURL + `/ingredients/${ ingredientId }.json`, {
      // default method in firebase is GET
              method: 'DELETE'
    }).then( response => {
        setIsLoading( false );
        setIngredients( prevIngredients =>
          prevIngredients.filter( ingredient => ingredient.id !== ingredientId )
        );
    }).catch( error => {
      setError( error.message );
      setIsLoading( false );
    });
  }

  // using this function to search through the filtered ingredients
  const filteredIngredientsHandler = useCallback( filteredIngredients  => {
    setIngredients( filteredIngredients );
  }, [] );

  const clearError = () => {
    setError( null );
  }

  return (
    <div className="App">
      { error 
          ? <ErrorModal onClose={ clearError }>{ error }</ErrorModal> 
          : null }
      <IngredientForm 
        addIngredient = { addIngredientHandler }
        loading = { isLoading } />

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
