import { useEffect, useState } from "react";
import "./App.css";
import { getAllPokemon, getPokemon } from "./utils/pokemon";
import Card from "../src/components/Card/Card";
import Navbar from "./components/Navbar/Navbar";

function App() {
  const initialURL = "https://pokeapi.co/api/v2/pokemon";
  const [isLoading, setIsLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState([]);
  const [prevURL, setPrevURL] = useState("");
  const [nextURL, setNextURL] = useState("");

  useEffect(() => {
    const fetchPokemonData = async () => {
      let res = await getAllPokemon(initialURL);
      loadPokemon(res.results);
      setPrevURL(res.previous);
      setNextURL(res.next);
      setIsLoading(false);
    };
    fetchPokemonData();
  }, []);

  const loadPokemon = async (data) => {
    let _pokemonData = await Promise.all(
      data.map(async (pokemon) => {
        let pokemonRecord = await getPokemon(pokemon.url);
        return pokemonRecord;
      })
    );
    setPokemonData(_pokemonData);
  };

  const handlePrevPage = async () => {
    if (!prevURL) return;

    setIsLoading(true);
    const data = await getAllPokemon(prevURL);
    await loadPokemon(data.results);
    setPrevURL(data.previous);
    setNextURL(data.next);
    setIsLoading(false);
  };

  const handleNextPage = async () => {
    setIsLoading(true);
    let data = await getAllPokemon(nextURL);
    await loadPokemon(data.results);
    setPrevURL(data.previous);
    setNextURL(data.next);
    setIsLoading(false);
  };

  return (
    <>
      <Navbar></Navbar>
      <div className="App">
        {isLoading ? (
          <h1>ローディング中</h1>
        ) : (
          <>
            <div className="pokemonCardContainer">
              {pokemonData.map((pokemon, i) => {
                return <Card key={i} pokemon={pokemon} />;
              })}
            </div>
            <div className="btn">
              <button onClick={handlePrevPage}>前へ</button>
              <button onClick={handleNextPage}>次へ</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
