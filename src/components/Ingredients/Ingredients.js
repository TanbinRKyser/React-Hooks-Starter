import React, { useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from '../Ingredients/IngredientList';
import Search from './Search';

function Ingredients() {

  const baseURL = 'URL';
  const [ ingredients, setIngredients ] = useState([]);

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
        return response.json();
    }).then( data => {
      setIngredients( prevIngredients => [ 
        ...prevIngredients, { 
          // name prop returned from firebase, not by us.
          id: data.name, 
          ...ingredient 
        } ] 
      );
    });

  }

  return (
    <div className="App">
      <IngredientForm addIngredient = { addIngredientHandler }/>

      <section>
        <Search />
        
        <IngredientList ingredients={ ingredients } onRemoveItem = { () => {} }/>
      </section>
    </div>
  );
}

export default Ingredients;
