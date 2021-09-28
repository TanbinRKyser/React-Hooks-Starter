import React,{ useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import ErrorModal from '../UI/ErrorModal';
import './Search.css';
import useHttp from '../../hooks/http';


const Search = React.memo( props => {

  const baseURL = 'URL';

  const [ filter, setFilter ] = useState('');
  const { onLoadIngredients } = props;
  const inputRef = useRef();
  const { loading, error, data, sendRequest, clearAll } = useHttp();


  useEffect( () => {
    const timer = setTimeout( () => {
        if( filter === inputRef.current.value ){
          const queryParams = 
            filter.length === 0 
            ? '' 
            : `?orderBy="title"&equalTo="${filter}"`;

          sendRequest( baseURL + '/ingredients.json' + queryParams, 'GET', );
        }
    }, 500);

    return () => {
      clearTimeout( timer );
    };

  },[ filter, inputRef, sendRequest ]);

  useEffect( () => {
    if( !loading && !error && data ){
      const loadedIngredients = [];
      for( let key in data ){
        loadedIngredients.push({
          id: key,
          title: data[ key ].title,
          amount: data[ key ].amount
        });
      }
      onLoadIngredients(loadedIngredients);
    }
  }, [ loading, error, data, onLoadIngredients ]);


  return (
    <section className="search">
      
      { error && <ErrorModal onClose={ clearAll }>{ error }</ErrorModal> }

      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          
          { loading && <span>Loading...</span> }

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
