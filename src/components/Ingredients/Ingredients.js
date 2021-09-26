import React, { useState, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from '../Ingredients/IngredientList';
import Search from './Search';

function Ingredients() {

  const baseURL = 'URL';
  const [ ingredients, setIngredients ] = useState([]);

  useEffect( () => {
              fetch( baseURL + '/ingredients.json').then( response => response.json() ).then( resData => {  
                const loadedIngredients = [];
                
                for( let key in resData ){
                  loadedIngredients.push({
                    id: key,
                    title: resData[key].title,
                    amount: resData[key].amount
                  });
                }

                setIngredients( loadedIngredients );
              })
  }, []);

  useEffect( () => {
    console.log("RENDERING", ingredients)
  }, [ingredients]);
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
