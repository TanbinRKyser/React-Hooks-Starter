import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from '../Ingredients/IngredientList';
import Search from './Search';

function Ingredients() {

  const baseURL = 'URL';
  const [ ingredients, setIngredients ] = useState([]);

  useEffect( () => {
    console.log( "RENDERING", ingredients )
  }, [ ingredients ]);


  // Getting data from IngredientForm and adding it current list of ingredients.
  const addIngredientHandler = ingredient => {
    // FetchAPI is JS function.
    fetch( baseURL + '/ingredients.json', {
      // default method in firebase is GET
              method: 'POST',
              body: JSON.stringify( ingredient ),
              headers: {
                'Content-Type' : 'application/JSON'
              }
    }).then( response => {
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
    
    fetch( baseURL + `/ingredients/${ ingredientId }.json`, {
      // default method in firebase is GET
              method: 'DELETE'
    }).then( response => {
        setIngredients( prevIngredients =>
          prevIngredients.filter( ingredient => ingredient.id !== ingredientId )
        );
    });

  }

  // using this function to search through the filtered ingredients
  const filteredIngredientsHandler = useCallback( filteredIngredients  => {
    setIngredients( filteredIngredients );
  }, [] );


  return (
    <div className="App">
      <IngredientForm addIngredient = { addIngredientHandler }/>

      <section>
        <Search onLoadIngredients={ filteredIngredientsHandler }/>
        
        <IngredientList
          ingredients={ ingredients }
          onRemoveItem={ removeIngredientHandler } />
      </section>
    </div>
  );
}

export default Ingredients;
