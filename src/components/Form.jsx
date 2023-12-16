// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from 'react';
import { useUrlPosition } from '../hooks/useUrlPosition';
import { useCities } from '../context/CitiesProvider';

import 'react-datepicker/dist/react-datepicker.css';

import DatePicker from 'react-datepicker';
import styles from './Form.module.css';
import Button from './Button';
import BackButton from './BackButton';
import Spinner from './Spinner';
import Message from './Message';
import { useNavigate } from 'react-router-dom';

// eslint-disable-next-line react-refresh/only-export-components
export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const { addCity, isLoading: isLoadingNewCity } = useCities();
  const navigate = useNavigate();

  const [lat, lng] = useUrlPosition();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emoji, setEmoji] = useState('');
  const [cityName, setCityName] = useState('');
  const [country, setCountry] = useState('');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!cityName || !date) return;

    const newCity = {
      cityName,
      country,
      emoji: convertToEmoji(emoji),
      date,
      notes,
      position: {
        lat,
        lng,
      },
    };
    await addCity(newCity);
    navigate('/app');
  }

  useEffect(() => {
    async function getCity() {
      try {
        setIsLoading(true);
        setError('');
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
        );
        const data = await res.json();
        if (!data.city)
          throw new Error('The position you have selected is not a city.');
        setCityName(data.city || data.locality);
        setCountry(data.countryName);
        setEmoji(data.countryCode);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    if (!lat && !lng) return;
    getCity();
  }, [lat, lng]);

  if (isLoading) return <Spinner />;
  if (error) return <Message message={error} />;
  if (!lat && !lng) return <Message message='Start by clicking on the map' />;

  return (
    <form
      className={`${styles.form} ${isLoadingNewCity && styles.loading}`}
      onSubmit={(e) => handleSubmit(e)}
    >
      <div className={styles.row}>
        <label htmlFor='cityName'>{country || 'City Name'}</label>
        <input
          id='cityName'
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor='date'>When did you go to {cityName}?</label>

        <DatePicker
          id='date'
          value={date}
          selected={date}
          onChange={(date) => setDate(date)}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor='notes'>Notes about your trip to {cityName}</label>
        <textarea
          id='notes'
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type='primary'>Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
