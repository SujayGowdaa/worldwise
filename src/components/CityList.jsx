/* eslint-disable react/prop-types */
import CityItem from './CityItem';
import styles from './CityList.module.css';
import Spinner from './Spinner';
import Message from './Message';
import { useCities } from '../context/CitiesProvider';

export default function CityList() {
  const { isLoading, cities } = useCities();

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : cities.length ? (
        <ul className={styles.cityList}>
          {cities.map((city) => (
            <CityItem city={city} key={city.id} />
          ))}
        </ul>
      ) : (
        <Message message='Add your first city by clicking on a city on the map' />
      )}
    </>
  );
}
