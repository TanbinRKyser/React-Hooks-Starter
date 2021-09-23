import React, { useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from '../Ingredients/IngredientList';
import Search from './Search';

function Ingredients() {

  const [ ingredients, setIngredients ] = useState([]);

  // Getting data from IngredientForm and adding it current list of ingredients.
  const addIngredientHandler = ingredient => {
    
    setIngredients( prevIngredients => [ 
                      ...prevIngredients, { 
                        id: Math.random().toString(), 
                        ...ingredient 
                      } ] 
                  );
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
