import "./App.css";
import React from "react";
import { useState } from "react";
import Pokemon from "pokemon-images";
function App() {
  // get from pokemon api all pokemon and store it in state
  const [pokemon, setPokemon] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentPokemon, setCurrentPokemon] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const getPokemons = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      // get all details of pokemon from api
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=151"
      );
      const data = await response.json();
      let pokemons = data.results.map((pokemon) => {
        return {
          name: pokemon.name,
          url: pokemon.url,
          src: Pokemon.getSprite(pokemon.name),
        };
      });
      setPokemon(pokemons);
      console.log(pokemons);
      setIsLoading(false);
    } catch (error) {
      setIsError(true);
    }
  };

  const openDialog = async (pokemon) => {
    console.log("openDialog", pokemon, isDialogOpen);
    let promiseArray = [];
    const data = await fetch(pokemon.url);
    promiseArray.push(data.json());
    const currentPokemonDetails = await Promise.all(promiseArray);
    // wait for details to be fetched
    // then pass details to state
    pokemon.details = currentPokemonDetails[0];
    setCurrentPokemon(pokemon);
    console.log(pokemon);
    setIsDialogOpen(true);
  };
  return (
    <div className="App">
      {isDialogOpen && (
        <div className="dialog">
          <div className="dialog-content">
            <div className="dialog-header">
              <h2>Pokemon</h2>
            </div>
            <div className="dialog-body">
              <div className="dialog-body-content">
                <div className="dialog-body-content-image">
                  <img src={currentPokemon.src} alt={currentPokemon.name} />
                </div>
                <div className="dialog-body-content-text">
                  <h3>{currentPokemon.name}</h3>
                </div>
              </div>
            </div>
            <div className="details-section">
              <div className="details-section-header">
                <h3>Details</h3>
              </div>
              <div className="details-section-body">
                <div className="details-section-body-content">
                  <div className="details-section-body-content-row">
                    <div className="details-section-body-content-column">
                      <div className="details-section-body-content-text">
                        <h4>Height</h4>
                        <p>{currentPokemon.details.height}</p>
                      </div>
                      <div className="details-section-body-content-text">
                        <h4>Weight</h4>
                        <p>{currentPokemon.details.weight}</p>
                      </div>
                      <div className="details-section-body-content-text">
                        <h4>Base Experience</h4>
                        <p>{currentPokemon.details.base_experience}</p>
                      </div>
                    </div>
                    <div className="details-section-body-content-column">
                      <div className="details-section-body-content-text">
                        <h4>Abilities</h4>
                        {currentPokemon.details.abilities.map((ability) => {
                          return (
                            <p key={ability.ability.name}>
                              {ability.ability.name}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="dialog-footer">
              <button onClick={() => setIsDialogOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
      <div className="get-pokemon">
        <button onClick={getPokemons}>Get Pokemons</button>
      </div>
      <div className="list">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="pokemon-grid">
            {pokemon.map((pokemon) => (
              <div
                key={pokemon.name}
                className="pokemon-card"
                onClick={() => openDialog(pokemon)}
              >
                <div className="pokemon-card-name">{pokemon.name}</div>
                <div className="pokemon-card-image">
                  <img
                    src={`${pokemon.src}`}
                    alt={pokemon.name}
                    className="pokemon-image"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default App;
