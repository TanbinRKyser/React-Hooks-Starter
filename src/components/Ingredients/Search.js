import React,{ useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo( props => {

  const baseURL = 'URL';

  const [ filter, setFilter ] = useState('');
  const { onLoadIngredients } = props;
  const inputRef = useRef();

  useEffect( () => {
      
    const timer = setTimeout( () => {
        if( filter === inputRef.current.value ){
          // carefully watch the backticks.
          const queryParams = 
            filter.length === 0 
            ? '' 
            : `?orderBy="title"&equalTo="${filter}"`;

          fetch( baseURL + '/ingredients.json' + queryParams )
            .then( response => response.json() )
              .then( resData => {  
                const loadedIngredients = [];
                
                for( let key in resData ){
                  loadedIngredients.push({
                    id: key,
                    title: resData[key].title,
                    amount: resData[key].amount
                  });
                }
                //...
                onLoadIngredients(loadedIngredients);
          });
        }
    }, 500);

    return () => {
      clearTimeout( timer );
    };

  },[ filter, onLoadIngredients, inputRef ]);


  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input 
            ref={ inputRef }
            type="text" 
            value={ filter } 
            onChange={ event => setFilter( event.target.value ) }  />
        </div>
      </Card>
    </section>
  );

});

export default Search;
