import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react';
import Button from '@mui/material/Button';
import MyLocationSharpIcon from '@mui/icons-material/MyLocationSharp';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { useRadioGroup } from '@mui/material';
import { createTheme} from '@mui/material/styles';
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";


const theme = createTheme({
    palette: {
      success: {
        // light: will be calculated from palette.primary.main,
        main: '#73ff7a'
        // dark: will be calculated from palette.primary.main,
        // contrastText: will be calculated to contrast with palette.primary.main
      },
      mode: 'dark'
    }
      
    })

const CustomTheme = createTheme({
    components: {
      MuiButton: {
        variants: [
          {props: { variant: "bold" },
            style: {
              fontWeight: "bold",
              color: "#73ff7a"}}]}}});

export default function weather() {

    const APIkey = "a0aacf0e9a9faab5cbb37f243e0f7f94"



    const initialState={
        long: 0,
        lat: 0,
        city: '',
        country: '',
        state: '',
        symbol: '°F',
        Celsius: 0,
        Farenheit: 0,
        lat_pos: 0,
        long_pos: 0,
        city_ip: "",
        country_ip: "",
        state_ip: ""
    }    

    const [state, setState] = useState(initialState)
    
    const SetUnit = (props) => {
        const radioGroup = useRadioGroup();
        useEffect(() => {if (radioGroup.value == 'Farenheit' && state.symbol == "°C") {
        setState({...state,
            symbol: '°F'})
    }
        if (radioGroup.value == 'Celsius' && state.symbol == "°F") {
        setState({...state,
            symbol: '°C'})
}})
            
    return (
        <FormControl>
    <FormControlLabel
      value={props.value}
      control={<Radio color='success'/>}
      label={props.label}
      labelPlacement="end"
    />
    </FormControl>
    )
}

    const getWeather = async () => {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${state.lat}&lon=${state.long}&appid=${APIkey}`)
        const data = await response.json()
        let Farenheit = 9/5*(data.main.temp-273) + 32
        let Celsius = data.main.temp - 273.15
        const F = Farenheit.toFixed(2)
        const C = Celsius.toFixed(2)
        setState({...state,
        Celsius: C,
    Farenheit: F
    })}

    const getCity = async () => {
        const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${state.lat_pos}&longitude=${state.long_pos}localityLanguage=en`)
        const data = await response.json()
        document.getElementById("cityInput").value = data.city;
        setState({...state,
        lat: data.latitude,
        long: data.longitude,
        state: data.localityInfo.administrative[1].name,
        country: data.countryCode,
        city: data.city
    })
    scrollDown()
    }

    const getCoordinatesForm = async (event) => {
        event.preventDefault()
        const city = event.target.elements.city.value
        const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIkey}`)
        const data = await response.json()
        setState({...state,
        long: data[0].lon,
        lat: data[0].lat,
        state: data[0].state,
        country: data[0].country,
        city: city
    })
    scrollDown()
  } 

    useEffect(() => {
        getWeather()
    }, [state.lat, state.long])

    const divRef = useRef(null);
    const mainRef = useRef(null);

    const scrollDown = () => {
      divRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    const scrollUp = () => {
      mainRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    const renderTemp = () => {
        let temperature = 0

        state.symbol == '°F' ? temperature = state.Farenheit : temperature = state.Celsius

        return <div className={styles.code}>The weather is {temperature}{state.symbol} in {state.city}, {state.state}</div>
    }
    
    return (
        <>           

<main className={styles.main} ref={mainRef}>
        <a className={styles.card}>
        
        <form 
        id='cityForm' 
        onSubmit={getCoordinatesForm} 
        className={styles.topnav} 
        >
      <label htmlFor="city">Enter your city's name:       </label>
      <input type="text" id="cityInput" name="city" required placeholder="Your city's name..."/>
    </form>             
                        <br></br>
                    <h2 className={styles.title}>OR</h2>
    <StyledEngineProvider injectFirst>
    <ThemeProvider theme={CustomTheme}>
    <Button
      size="large"
      sx={{ mt:0, ml: 0 }}
      variant= 'bold'
      onClick={getCity}>
          <MyLocationSharpIcon/> 
        Use your current location
      </Button>
    </ThemeProvider>
    </StyledEngineProvider>
        </a> 
        <Link href='/'>
            <a className={styles.card}>Back to home</a>
        </Link>
    </main>
      <div ref={divRef}>
    <main className={styles.main} align="center">
    <h2>{renderTemp()}</h2>
    <ThemeProvider theme={theme}>
        <RadioGroup name="use-radio-group" defaultValue="Farenheit">
        <SetUnit value="Celsius" label="Celsius" control={<Radio />} />
        <SetUnit value="Farenheit" label="Farenheit" control={<Radio />} />
        </RadioGroup>
        </ThemeProvider>
      <Button color='success' onClick={scrollUp} className={styles.card}>Choose a different city</Button>
    </main>
    
    </div>
    
    </>
    )
}