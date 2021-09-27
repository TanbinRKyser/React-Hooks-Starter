import React, { useReducer, 
                // useState, 
                useEffect, 
                useCallback } from 'react';

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
  // const [ ingredients, setIngredients ] = useState([]);
  // const [ isLoading, setIsLoading ] = useState( false );
  // const [ error, setError ] = useState( );

  useEffect( () => {
    console.log( "RENDERING", ingredients )
  }, [ ingredients ]);


  // Getting data from IngredientForm and adding it current list of ingredients.
  const addIngredientHandler = ingredient => {
    // setIsLoading( true );
    dispatchHttp({ type: 'SEND' });
    // FetchAPI is JS function.
    fetch( baseURL + '/ingredients.json', {
      // default method in firebase is GET
              method: 'POST',
              body: JSON.stringify( ingredient ),
              headers: {
                'Content-Type' : 'application/JSON'
              }
    }).then( response => {
      // setIsLoading( false );
      dispatchHttp({ type: 'RESPONSE' });
      // Converting the response into a json.
      return response.json();
    }).then( 
          // data is basically data = response.json();
          data => {
              /* setIngredients( prevIngredients => [ 
                ...prevIngredients, { 
                  // data.name -> name prop returned from firebase, not by author/react.
                  id: data.name, 
                  ...ingredient 
                } ] 
              ); */
          dispatchIngredients({ type: 'ADD', ingredients: { 
                                    id: data.name, 
                                    ...ingredient } 
                  })
    });
  }

  const removeIngredientHandler = ingredientId => {
    
    // setIsLoading( true );
    dispatchHttp({ type: 'SEND' });

    fetch( baseURL + `/ingredients/${ ingredientId }.json`, {
      // default method in firebase is GET
              method: 'DELETE'
    }).then( response => {
        // setIsLoading( false );
        dispatchHttp({ type: 'RESPONSE' });

        /* setIngredients( prevIngredients =>
          prevIngredients.filter( ingredient => ingredient.id !== ingredientId )
        ); */
        dispatchIngredients({ type: 'DELETE',  id: ingredientId });
    }).catch( error => {
        // setError( error.message );
        // setIsLoading( false );
        dispatchHttp({ type: 'ERROR', errorMessage: error.message });
    });
  }

  // using this function to search through the filtered ingredients
  const filteredIngredientsHandler = useCallback( filteredIngredients  => {
    // setIngredients( filteredIngredients );
    dispatchIngredients({ type: 'SET', ingredients: filteredIngredients });
  }, [] );

  const clearError = () => {
    // setError( null );
    dispatchHttp({ type: 'CLEAR' });
  }

  return (
    <div className="App">
      {/* { error 
          ? <ErrorModal onClose={ clearError }>{ error }</ErrorModal> 
          : null } */}
      { httpState.error 
          ? <ErrorModal onClose={ clearError }>{ httpState.error }</ErrorModal> 
          : null }

      {/* <IngredientForm 
        addIngredient = { addIngredientHandler }
        loading = { isLoading } /> */}  
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
