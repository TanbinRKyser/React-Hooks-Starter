import React,{ useState, useEffect } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo( props => {

  const baseURL = 'URL';
  const [ filter, setFilter ] = useState('');
  const { onLoadIngredients } = props;

  useEffect( () => {
                // carefully watch the backticks.
                const queryParams = 
                        filter.length === 0 
                        ? '' 
                        : `?orderBy="title"&equalTo="${filter}"`;

                fetch( baseURL + '/ingredients.json' + queryParams ).then( response => response.json() ).then( resData => {  
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
  },[ filter, onLoadIngredients ]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input type="text" value={ filter } onChange={ event => setFilter( event.target.value ) }  />
        </div>
      </Card>
    </section>
  );
});

export default Search;
