import {IconButton, Typography } from '@material-ui/core';
import FlagOutlinedIcon from '@material-ui/icons/FlagOutlined';
import { Replay } from '@material-ui/icons';
import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [nameflag, setNameflag] = useState([])
  const [placename, setPlaceName] = useState('Given Name')
  const [ef, setEf] = useState('1')
  let flag, comp

  useEffect(() => {
    console.log('skipidi booop baa skipidi baaaeee')
    let nameflagInit = []
    axios.get('https://ctfreg.herokuapp.com/enterflag').then(res => {
      res.data.forEach(item => {
        nameflagInit.push({
          name: item.competitor,
          flag: item.flagcount
        })
      })
      for (let a = 0; a < nameflagInit.length; a++){
        for (let b = 0; b < nameflagInit.length; b++){
          if (nameflagInit[a].flag < nameflagInit[b].flag) {
            let temp = nameflagInit[a]
            nameflagInit[a] = nameflagInit[b]
            nameflagInit[b] = temp
          }
        }
      }
      console.log('d')
      setNameflag(nameflagInit)
      setEf('0')
    })
  }, [ef])
  
  function Cards() {
    return (
      <>{
        nameflag.map(item => {
          return(
            <div className='containercard' key={item.name}
              onMouseEnter={() => setPlaceName(item.name)}
              onMouseLeave={() => setPlaceName('Given Name')}
              onClick={() => {
              navigator.clipboard.writeText(item.name).then(res => alert('nameCopied'))
            }}>
              <div className='name'>{item.name}</div>
              <div className='flagcount'>
                <FlagOutlinedIcon style={{color: 'orangered', float: 'left'}}/>
                <Typography style={{marginLeft: '10px', float: 'left', color: 'grey'}}>{item.flag + " Flags"}</Typography>
              </div>
              <div className='count'>
                <div className='hovercount'>{nameflag.indexOf(item)}</div>
              </div>
            </div>
          )
        })
      }</>
    )
  }

  return (
    <div className="App">
      <div className='title'>Clash For Flags</div>
      <div className='appmain'>
        
        <div className='inputleft'>
          <div className='inputdata'>
            <div className='inputcenter'>
              <input onChange={e => {
                flag = e.target.value
              }} placeholder='Flag Obtained'/>
              <input onChange={e => {
                comp = e.target.value
              }} placeholder={placename}/>
              <div style={{ margin: '0 auto', width: 'fit-content' }}><button onClick={() => {
                console.log(flag,comp)
                axios.post('https://ctfreg.herokuapp.com/enterflag', {
                  flag: flag,
                  competitor: comp
                }).then(res => {
                  axios.delete('https://ctfreg.herokuapp.com/flag', {
                    flag: flag
                  }).then(res2 => {
                    if (res2.status !== 200) console.log(res2.data.message)
                    else {
                      if (res.data.message === 'wrong flag!!') alert(res.data.message + " :warning")
                      if (res.data.message) alert(res.data.message.message + " :warning")
                      else if (res.status === 200) {
                        alert('Move on, Flag Uploaded!')
                      }
                    }
                    setEf('1')
                  })
                })
              }} className='putin'>Enter the Flag</button></div>
            </div>
          </div>
          <div className='encrypmsg'>WW91ciBCYWQsIGJpdGNoClJpYXMgR3JlbW9yeSBEaWVzIQ==</div>
        </div>
        
        <div className='leaderright'>
          <div className='tab'>
            <div className='iconrel'>
              <IconButton onClick={()=>setEf('1')} style={{float: 'left', color:'#f19232'}}>
                <Replay />
              </IconButton>
              <div className='tabhead'>Leaderboard</div>
            </div>
          </div>
          <div className='cardcol'>
            <Cards/>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
