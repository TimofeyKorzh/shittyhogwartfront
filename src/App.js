import { TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
//import Button from './components/Button';
import Button from '@material-ui/core/Button'
import {MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import './styles.scss';
import { postGenerateTextEndpoint,  postGenerateVarsEndpoint} from './utils';
//import {Helmet} from "react-helmet";
import { YMInitializer } from 'react-yandex-metrika';
import CircularProgress from '@material-ui/core/CircularProgress'
import { withStyles } from '@material-ui/core/styles'
import { Container } from '@material-ui/core';
import { Box } from '@material-ui/core';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const TITLE = 'Всратый Хогвратс';


function App() {
  const [toggle, setToggle] = useState(false);
  const [toggleText, setToggleText] = useState(false);
  const [text, setText] = useState("Раннее утро.");
  const [viewText, setViewText] = useState(text);
  const [generatedText, postGenerateText] = postGenerateTextEndpoint();
  const [generatedVars, postGenerateVars] = postGenerateVarsEndpoint();
  const [isStarted, setStarted] = useState(false)
  const [VariantsButtons, setVariantButtons] = useState([])
  const [selfVariant, setSelfVariant] = useState("")
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleFormChange = (event) => {
    setSelfVariant(event.target.value);
  };



  useEffect(() => {
    document.title = TITLE;
 }, []);
  
  const THEME = createMuiTheme({
    typography: {
     "fontFamily": `"MinionPro", sans-serif`,
     "fontSize": 14,
     "fontWeightLight": 300,
     "fontWeightRegular": 400,
     "fontWeightMedium": 500
    },
 });

 const styles = {
  root: {
    marginLeft: 5
  }
}
const SpinnerAdornment = withStyles(styles)(props => (
  <CircularProgress
    className={props.classes.spinner}
    size={10}
    style={{marginLeft: "0.5em"}}
  />
))
const AdornedButton = (props) => {
  const {
    children,
    loading,
    ...rest
  } = props
  return (
    <Button size="large" disabled={loading} style={{ marginTop: '0.11em', marginBottom: '0.1em', width: 'fit-content', paddingBottom: '0.1em', backgroundColor: 'transparent'}}

    color="primary"
    {...rest}>
       
      {children}
      {loading && <SpinnerAdornment  {...rest} />}
      
    </Button>
  )
}
  const generateVars = () => {
    
    generatedVars.complete = false;
    var prompt = text
    postGenerateVars({prompt});
    setToggle(false);
  }
  const generateText = (key) => {
    let t = key.target.textContent;
    setStarted(false)
    generatedText.complete = false;
    generatedText.pending = true;
    var prompt = text + " <|query|> " + t + " <|query|> "
    postGenerateText({prompt});
    setViewText(viewText+"\n > "+ t+"\n")
    setToggleText(false);
  }

  const generateTextFromDialog = () => {
    let t = selfVariant
    setOpen(false);
    setStarted(false)
    generatedText.complete = false;
    generatedText.pending = true;
    var prompt = text + " <|query|> " + t + " <|query|> "
    postGenerateText({prompt});
    setViewText(viewText+"\n > "+ t+"\n")
    setToggleText(false);
  }

  if (generatedText.complete && !generatedText.error && !toggleText){
    
    generatedText.pending = false;
    console.log(generatedText.data.text)
    setText(text+" "+ generatedText.data.text);
    setViewText(viewText+" "+ generatedText.data.text)
    console.log(viewText.replace("<|query|>", ' ').replace("<|query|>", ' '))
    setToggleText(true);
  }
  if (generatedVars.complete && !generatedVars.error && !toggle){
    setStarted(true)
    console.log(generatedVars)
    let VButtons = [];
    let i = 0;
    generatedVars.data.variants.forEach((variant, index)=>{
      VButtons.push(<AdornedButton key = {index} onClick={generateText} Text={variant} loading = {generatedText.pending}>
        {variant}
       </AdornedButton>);
       i = index;
    })
    VButtons.push(<AdornedButton key = {i+1} onClick={handleClickOpen} loading = {generatedText.pending}>
    Свой вариант
   </AdornedButton>)
    setVariantButtons(VButtons)
    console.log(VariantsButtons)
    //setText(generatedVars.data.variants[0]);
    setToggle(true);
  }
  return (
    
    <MuiThemeProvider theme ={THEME}>
    <div className="application">
      </div>
    <div className='app-container'>
      
    <YMInitializer accounts={[89370862]} options={{webvisor: true}}/>
    
    <form noValidate autoComplete='off'> 
    <div>
      <div class="image hide-mobile Back">
      <img src="хагрид.png" width="220" height="220"></img>
        
        <p></p>
       </div> 
       
       
       <span><h1>Всратый Хогвартс</h1></span>
       <small>by <a href="https://t.me/lovedeathtransformers">Alex Wortega</a>, <a href="https://monetka.name">Moneta</a> and Anon</small>
       </div>
       
       
       
       <Box textAlign='left'>
        {viewText.replace('<|query|>', ' ').replace('<|query|>', ' ').split('\n').map(str => <p>{str}</p>)}
        </Box>
        <Box textAlign='center'>
        {
        (isStarted === false || generatedVars.pending) &&
        <AdornedButton onClick={generateVars} loading = {generatedVars.pending || generatedText.pending}>
         Какие у меня варианты?
        </AdornedButton>
        }
        {(isStarted === true ) && VariantsButtons}
        
        
        
        </Box>
        
        </form>
      
    </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Свой вариант</DialogTitle>
        <DialogContent>
          
          <TextField
            autoFocus
            margin="dense"
            id="selfaction"
            label="Что ты ты делаешь?"
            fullWidth
            variant="standard"
            onChange={handleFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button onClick={generateTextFromDialog}>Ввод</Button>
        </DialogActions>
      </Dialog>
    
    </MuiThemeProvider>
  );
}

export default App;
//{generatedText.pending&&
  //<div className='result pending'>Подождите!</div>}
  //
