/* eslint-disable react/prop-types */
import { useCities } from '../context/CitiesProvider';
import CountryItem from './CountryItem';
import styles from './CountryList.module.css';
import Message from './Message';
import Spinner from './Spinner';

export default function CountryList() {
  const { isLoading, cities } = useCities();

  const country = cities.reduce((acc, cur) => {
    if (!acc.map((el) => el.country).includes(cur.country)) {
      return [...acc, { country: cur.country, emoji: cur.emoji }];
    } else {
      return acc;
    }
  }, []);

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : country.length ? (
        <ul className={styles.countryList}>
          {country.map((country) => (
            <CountryItem country={country} key={country.country} />
          ))}
        </ul>
      ) : (
        <Message message='Add your first country by clicking on a country on the map' />
      )}
    </>
  );
}
