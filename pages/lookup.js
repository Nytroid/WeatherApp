import styles from '../styles/Home.module.css';

import Button from '@mui/material/Button';
import MyLocationSharpIcon from '@mui/icons-material/MyLocationSharp';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { useRadioGroup } from '@mui/material';
import { createTheme} from '@mui/material/styles';
import Grow from '@mui/material/Grow';
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import Grid from '@mui/material/Grid';
import Fade from '@mui/material/Fade'
import Bounce from 'react-reveal/Bounce'; 
import { useEffect, useState, useRef } from 'react';



const theme = createTheme({
    palette: {
      success: {
        main: '#73ff7a'
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


function CustomButton(props) {
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={CustomTheme}>
      <Button
      className={styles.Weathercard}
      size="medium"
      sx={{ mt:0, ml: 0 }}
      variant= 'bold'
      onClick={props.scroll}>
          {props.text}
      </Button>
      </ThemeProvider>
      </StyledEngineProvider>
}

export default function Weather() {
    const APIkey = "a0aacf0e9a9faab5cbb37f243e0f7f94"



    const initialState={
        long: '',
        lat: '',
        city: '',
        country: '',
        state: '',
        symbol: '°F',
        Celsius: 0,
        Farenheit: 0,
        date: 0,
        TwoHourCelsius: 'None',
        TwoHourFarenheit: 'None',
        FeelsLikeCelsius: 0,
        FeelsLikeFarenheit: 0,
        showTemp: true,
        windowWidth: 1000,
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
      labelPlacement="bottom"
    />
    </FormControl>
    )
}
    const getWeather = async () => {
      if (state.lat != 0 && state.long != 0) {
        try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${state.lat}&lon=${state.long}&exclude=minutely,daily&appid=${APIkey}`)
        const data = await response.json()
          let Farenheit = 9/5*(data.current.temp-273) + 32
          let Celsius = data.current.temp - 273.5
          const F = Farenheit.toFixed(0)
          const C = Celsius.toFixed(0)
          let FeelsLikeFarenheit = 9/5*(data.current.feels_like-273) + 32
          let FeelsLikeCelsius = data.current.feels_like - 273.5
          const FF = FeelsLikeFarenheit.toFixed(0)
          const FC = FeelsLikeCelsius.toFixed(0)
          const myDate = new Date(data.hourly[2].dt*1000);
          const TwoHourTemp = data.hourly[2].temp
          const TwoHourFeelsLike = data.hourly[2].feels_like
          const FarenheitHour = 9/5*(TwoHourTemp-273) + 32
          const CelsiusHour = TwoHourTemp - 273.5
          const FH = FarenheitHour.toFixed(0)
          const CH = CelsiusHour.toFixed(0)   

          const FeelsLikeFarenheitHour = 9/5*(TwoHourFeelsLike-273) + 32
          const FeelsLikeCelsiusHour = TwoHourFeelsLike - 273.5
          const FFH = FeelsLikeFarenheitHour.toFixed(0)
          const FCH = FeelsLikeCelsiusHour.toFixed(0)   
          setState({...state,
            date: myDate,
          Celsius: C,
          Farenheit: F,
          TwoHourCelsius: CH,
          TwoHourFarenheit: FH,
          FeelsLikeFarenheit: FF,
          FeelsLikeCelsius: FC,
          FeelsLikeFarenheitHour: FFH,
          FeelsLikeCelsiusHour: FCH,
          windowWidth: window.innerWidth
      })}
        catch(err){
          if (err == "TypeError: Cannot read properties of undefined (reading 'temp')") {
            setState({...state,
            Farenheit: 'None',
          Celsius: 'None'})} else {
          window.alert(err)}
            }}

        }

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
        if (data.length == 0) {
          setState({...state, 
          Farenheit: 'None',
          Celsius: 'None'})
      } else {
        setState({...state,
        long: data[0].lon,
        lat: data[0].lat,
        state: data[0].state,
        country: data[0].country,
        city: city
    })}
    scrollDown()
  } 

    useEffect(() => {
        getWeather()
    }, [state.lat, state.long])

    const divRef = useRef(null);
    const mainRef = useRef(null);
    const hourlyRef = useRef(null);


    const scrollDown = () => {
      divRef.current.scrollIntoView({ behavior: 'smooth'});
      setState({...state,
        showTemp: true})
    }

    const scrollUp = () => {
      mainRef.current.scrollIntoView({ behavior: 'smooth' });
      setState({...state,
        showTemp: false})
      }

      const mobileScrollDown = () => {
        hourlyRef.current.scrollIntoView({ behavior: 'smooth', block: 'center'});
        setState({...state,
          showMobileHourly: true, 
          })
      }

      const Weather = () => {
        return (
        <Grid container
            direction='row'
            justifyContent='space-evenly'
            >
            <Grid item>
             <HourlyWeather />
            </Grid>
          <Grid item>
            <Temp/>
          </Grid>
          <Grid item>
            <HourlyWeather />
            </Grid>
        </Grid>
        )}

    const Temp = () => {
        let temperature = 0
        let FeelsLike

        state.symbol == '°F' ? temperature = state.Farenheit : temperature = state.Celsius
        const negativeZero = temp => {
          return 1/temp === -Infinity;
        }
        if (negativeZero(temperature)) {temperature = 0}
        state.symbol == '°F' ? FeelsLike = state.FeelsLikeFarenheit : FeelsLike = state.FeelsLikeCelsius
        if (negativeZero(FeelsLike)) {FeelsLike = 0}
        if (state.Farenheit == 'None' && state.Celsius == 'None') return (
          <div className={styles.main}>
          City not found
          <br></br>
        <StyledEngineProvider injectFirst>
        <ThemeProvider theme={CustomTheme}>
        <Button
          className={styles.card}
          size="medium"
          sx={{ mt:0, ml: 0 }}
          variant= 'bold'
          onClick={scrollUp}> 
              &#x21E7; Find a different city &#x21E7;
        </Button>
      </ThemeProvider>
      </StyledEngineProvider>
      </div>
          )

        return ( 
          <>
          <div className={styles.Weathercard}>
            <h1>Temperature: {temperature}{state.symbol}</h1>
            <h1>Feels Like: {FeelsLike}{state.symbol}</h1>
            <p className={styles.code}> In {state.city}, {state.state} </p> 
          
        </div>
        <div align='center' className={styles.center}>
        <ThemeProvider theme={theme}>
        <RadioGroup row name="use-radio-group" defaultValue="Farenheit">
        <SetUnit value="Celsius" label="Celsius" control={<Radio />} />
        <SetUnit value="Farenheit" label="Farenheit" control={<Radio />} />
        </RadioGroup>
        </ThemeProvider>
        </div>
        <div>
    <StyledEngineProvider injectFirst>
    <ThemeProvider theme={CustomTheme}>
        <Button
        className={styles.Weathercard}
      size="medium"
      sx={{ mt:0, ml: 0 }}
      variant= 'bold'
      onClick={scrollUp}>&#x21E7; Choose a different city &#x21E7;

      </Button>
      </ThemeProvider>
      </StyledEngineProvider>
      </div>
      </>
        )
    }

    const MobileView = () => {
       return (
         <>
         <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
         <Temp />
         <StyledEngineProvider injectFirst>
    <ThemeProvider theme={CustomTheme}>
        <Button
        className={styles.Weathercard}
      size="medium"
      sx={{ mt:0, ml: 0 }}
      variant= 'bold'
      onClick={mobileScrollDown}> 
      &#x21E9; View Hourly Weather &#x21E9;
      </Button>
      </ThemeProvider>
      </StyledEngineProvider>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>     
        <br></br>   
      <div ref={hourlyRef} className={styles.main}>
        <HourlyWeather />
        <StyledEngineProvider injectFirst>
    <ThemeProvider theme={CustomTheme}>
        <Button
        className={styles.Weathercard}
      size="medium"
      sx={{ mt:0, ml: 0 }}
      variant= 'bold'
      onClick={scrollUp}>&#x21E7; Choose a different city &#x21E7;

      </Button>
      <Button
        className={styles.Weathercard}
      size="medium"
      sx={{ mt:0, ml: 0 }}
      variant= 'bold'
      onClick={scrollDown}>&#x21E7; Go to current weather &#x21E7;

      </Button>
      </ThemeProvider>
      </StyledEngineProvider>
      

        <br></br> 
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        
         </div>
          </>
       )
    }

    const HourlyWeather = () => {
      const negativeZero = temp => {
        return 1/temp === -Infinity;
      }

      let date = state.date
      let today = new Date()
      let difference = Math.abs(date - today)
      let diffHrs = Math.ceil(difference / (1000 * 60 * 60))
      let hour = 'hour'
      let temp = state.TwoHourCelsius
      let FeelsLike = state.FeelsLikeCelsiusHour
      if (diffHrs > 1) hour = 'hours'
      if (state.symbol == '°F') {temp = state.TwoHourFarenheit}
      if (negativeZero(temp)) {temp = 0}
      if (state.symbol == '°F') {FeelsLike = state.FeelsLikeFarenheitHour}
      if (negativeZero(FeelsLike)) {FeelsLike = 0}
      return (
      <>
      <div className={styles.Weathercard}>
      <p className={styles.code}>The temperature will be</p>
      <h1> {temp}{state.symbol}</h1>
      <p className={styles.code}>and</p>
      <h1>Feel Like: {FeelsLike}{state.symbol}</h1>
      <p className={styles.code}> In {diffHrs} {hour} </p> 
      </div>
      </>
      )}
    
    return (
        <>           
<main className={styles.main} ref={mainRef}>
        <a className={styles.card}>
        <form 
        id='cityForm' 
        onSubmit={getCoordinatesForm} 
        className={styles.form} 
        >
      <label htmlFor="city"> Enter your city&#39;s name:       </label>
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
    </main>
      <div ref={divRef}>
        
    <main className={styles.main} align="center">

  <Bounce left opposite when={state.showTemp}>
    {state.windowWidth > 970 ? <Weather /> : <MobileView />}
  </Bounce>

    </main>
    </div>
    </>
    )
}