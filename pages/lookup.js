import styles from '../styles/Home.module.css';

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
import Grid from '@mui/material/Grid';

import Bounce from 'react-reveal/Bounce'; 

import { useViewportSize } from '@mantine/hooks';


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


export default function Weather() {
    const APIkey = "a0aacf0e9a9faab5cbb37f243e0f7f94"

    const  {width} = useViewportSize()

    const initialState={
        long: '',
        lat: '',
        city: '',
        country: '',
        state: '',
        symbol: '°C',
        Celsius: 0,
        Farenheit: 0,
        date: 0,
        TwoHourCelsius: 0,
        TwoHourFarenheit: 0,
        FeelsLikeCelsius: 0,
        FeelsLikeFarenheit: 0,
        FeelsLikeCelsiusHour: 0, 
        FeelsLikeFarenheitHour: 0,
        showTemp: true,
        error: true
    }    

    const [state, setState] = useState(initialState)
    
    const SetUnit = (props) => {      //Find out what unit should be shown and set that unit as symbol in state. Is actually a component
        const radioGroup = useRadioGroup();
        useEffect(() => {if (radioGroup.value == 'Farenheit' && state.symbol == "°C") {
        setState({...state,
            symbol: '°F'})
    }
        if (radioGroup.value == 'Celsius' && state.symbol == "°F") {
        setState({...state,
            symbol: '°C'})
}})
            
    return (  // return the Radio controls to toggle unit
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

    const getWeather = async () => {  //get weather data from api using latitude and longitude, only if lat and long arent empty. In try catch format
      if (state.lat !== '' && state.long !== '') {
        try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${state.lat}&lon=${state.long}&exclude=minutely,daily&appid=${APIkey}`)
        const data = await response.json()
          let Farenheit = 9/5*(data.current.temp-273) + 32 //Gets all temperature needed, including hourly temp and datetime
          let Celsius = data.current.temp - 273.5
          const F = Math.round(Farenheit)
          const C = Math.round(Celsius)
          let FeelsLikeFarenheit = 9/5*(data.current.feels_like-273) + 32
          let FeelsLikeCelsius = data.current.feels_like - 273.5
          const FF = Math.round(FeelsLikeFarenheit)
          const FC = Math.round(FeelsLikeCelsius)
          const myDate = new Date(data.hourly[2].dt*1000); 
          const TwoHourTemp = data.hourly[2].temp
          const TwoHourFeelsLike = data.hourly[2].feels_like
          const FarenheitHour = 9/5*(TwoHourTemp-273) + 32
          const CelsiusHour = TwoHourTemp - 273.5
          const FH = Math.round(FarenheitHour)
          const CH = Math.round(CelsiusHour)

          const FeelsLikeFarenheitHour = 9/5*(TwoHourFeelsLike-273) + 32
          const FeelsLikeCelsiusHour = TwoHourFeelsLike - 273.5
          const FFH = Math.round(FeelsLikeFarenheitHour)
          const FCH = Math.round(FeelsLikeCelsiusHour)

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
          error: false
      })}
        catch(err){
          if (err == "TypeError: Cannot read properties of undefined (reading 'temp')") {}
             else {
          window.alert(err)
        }
          
          setState({...state,
            Farenheit: 0,
          Celsius: 0, 
          error: true})
        }}
        }

    const getCity = async () => {  //Uses ip address geocoder to return latitude, longitude, and details of city
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

    const getCoordinatesForm = async (event) => {  //Uses geocoder api to get lat and long of city given in Form
        event.preventDefault()
        const city = event.target.elements.city.value
        const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIkey}`)
        const data = await response.json()
        if (data.length == 0) {
          setState({...state, 
          Farenheit: 0,
          Celsius: 0, 
        error: true})
      } else {
        setState({...state,
        long: data[0].lon,
        lat: data[0].lat,
        state: data[0].state,
        country: data[0].country,
        city: city, 
        error: false
    })}
    scrollDown()
  } 

    useEffect(() => {
        getWeather()
    }, [state.lat, state.long])

    const divRef = useRef(null);  // refs for scrolling down
    const mainRef = useRef(null);
    const hourlyRef = useRef(null);


    const scrollDown = () => {  // scroll up/down functions
      divRef.current.scrollIntoView({ behavior: 'smooth', block: 'start'});
      setState({...state,
        showTemp: true})
    }

    const scrollUp = () => {
      mainRef.current.scrollIntoView({ behavior: 'smooth'});
      setState({...state,
        showTemp: false})
      }

      const mobileScrollDown = () => {
        hourlyRef.current.scrollIntoView({ behavior: 'smooth', block: 'center'});
      }

      const Weather = () => {  // Displays all weather information in a component using <Temp/> and <HourlyWeather />
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

    const Temp = () => {  // Uses state for temperature and unit and puts them into a card 
        let temperature = 0
        let FeelsLike

        state.symbol == '°F' ? temperature = state.Farenheit : temperature = state.Celsius
        const negativeZero = temp => {
          return 1/temp === -Infinity;
        }
        if (negativeZero(temperature)) {temperature = 0}  // Convert -0 into 0
        state.symbol == '°F' ? FeelsLike = state.FeelsLikeFarenheit : FeelsLike = state.FeelsLikeCelsius
        if (negativeZero(FeelsLike)) {FeelsLike = 0}
        if (state.error) return (  // If temp is undefined, return city not found (Doesn't work right now)
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

        return ( // Card for all temperature details and F to C unit toggle underneath
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

    const MobileView = () => {  //Generates seperate component if windowWidth is too small to display it well using the normal Weather Component. 
                                //Basically just spreads out all the info into 2 pages that can be scrolled through using buttons. 
                                //<br>s are to make it look better. 
       return (
         <>
        <main className={styles.main}>
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
        {/* <br></br>   
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
        <br></br>      */}
        {/* <br></br>    */}
      <div ref={hourlyRef} className={styles.main}>
      <Bounce left opposite >
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
      onClick={scrollDown}>&#x21E7; Go BACK to current weather &#x21E7;

      </Button>
      </ThemeProvider>
      </StyledEngineProvider>
      </Bounce>

        {/* <br></br>  */}
        {/* <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br> */}
         </div>
         </main>
          </>
       )
    }

    const HourlyWeather = () => {  //Shows HourlyTemp, similar to <Temp /> but different information displayed, and shows the time of that weather
      const negativeZero = temp => { // Negatuve Zero checker
        return 1/temp === -Infinity;
      }

      let date = state.date
      let today = new Date()
      let difference = Math.abs(date - today)
      let diffHrs = Math.ceil(difference / (1000 * 60 * 60))
      let hour = 'hour'
      let temp
      let FeelsLike = state.FeelsLikeCelsiusHour
      if (diffHrs > 1) hour = 'hours'

      state.symbol == '°F' ? temp = state.TwoHourFarenheit : temp = state.TwoHourCelsius
      if (negativeZero(temp)) {temp = 0}
      if (state.symbol == '°F') {FeelsLike = state.FeelsLikeFarenheitHour}
      if (negativeZero(FeelsLike)) {FeelsLike = 0}
      return (  
      <>
      <div className={styles.Weathercard}>
      <p className={styles.code}>The temperature will be</p>
      <h1> {temp}{state.symbol}</h1>
      <p className={styles.code}>and</p>
      <h1>FeelS Like: {FeelsLike}{state.symbol}</h1>
      <p className={styles.code}> In {diffHrs} {hour} </p> 
      </div>
      </>
      )}
    
      const Form = () => {   // Component for the form
        return (
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
        )
      }


    return ( // Puts the components together. I guess. 
        <>           
        <Form />
      <div ref={divRef}>
        
    <main className={styles.main} align="center">

 <Bounce left opposite when={state.showTemp}>         {/*<Bounce/> is for animation. {when} == when to show  child component */}
    {width > 985 ? <Weather /> : <MobileView />}  {/*Checks if the windowWidth is mobileView or desktop(normal) view*/}
  </Bounce>

    </main>
    </div>
    </>
    )
}