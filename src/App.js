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
          if (nameflagInit[a].flag > nameflagInit[b].flag) {
            let temp = nameflagInit[a]
            nameflagInit[a] = nameflagInit[b]
            nameflagInit[b] = temp
          }
        }
      }
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
                      else if (res.data.message) alert(res.data.message + " :warning")
                      else alert('Move on, Flag Uploaded!')
                    }
                    setEf('1')
                  })
                })
              }} className='putin'>Enter the Flag</button></div>
            </div>
          </div>
          <div className='encrypmsg'>CgoiY29uZ3JhdHVsYXRpb25zIG9uIHlhciBmaXJzIHN0ZXAgdG93YXJkcyB0aGUgY29tcGVpdGlvbiIKCnNvIGkgaG9wZSB5b3UgZGVjcnlwdGVkIHRoZSBoYXNoIGFsZ29yaXRoLi4uLgoKYW5kIG5vdyB5b3UgYXJlIHNlZWluZyB0aGUgd29ybGRzIHdvcnN0IGFuZCB1Z2xpZXN0IGRvY2N1bWVudGF0aW9uIGJ1dCBoYW5nIG9uIHlvdSBuZWVkIHRvIGZpbmQgdGhlIHdheSBvdXQgaGVyZSByaWdodD8/CgpzbyBvbmNlIGRlIGNyeXB0ZWQgeW91IHdpbGwgaGF2ZSBhbiBhcGkgbGluayB3YWl0aW5nIGZvciB5YS4uLi4KCgpva2F5IHRoaXMgZmlsZSBmb3IgaGVscGluIHlvdSBhcm91bmQgdGhlIGFwaQoKCnNvIHRoZSBmaXJzdCBzdGVwIGZvciB5b3UgaXMgdG8gYWNjZXNzIHRoZSBhcGkgYW5kIGdldCB5b3VyIGZpcnN0IGZsYWcuLi4KCnNvIHRoZSBzaW1wbGUgYW5kIGJhc2ljIHN0ZXAgeW91IGFyZSBnb2luZyB0byBkbyBpcyAKCnNlbmQgYW4gcG9zdCByZXF1ZXN0IHRvIHRoZSBmb2xsb3dpbmcgbGluawoKImh0dHBzOi8vY3RmcmVnLmhlcm9rdWFwcC5jb20vY3RmIgoKeW91IHdpbGwgaGF2ZSBubyBhY2Nlc3MgY2F1c2UgeW91IGhhdmVudCBwcm92aWRlZCB1cyB3aXRoIGFueSBkZXRhaWxzCnBpdHR5IG9mIG1lIGhhdmVudCB0b2xkIHRoYXQgYmVmb3JlISEhIQoKc28geW91IHdhbnQgdG8gaW5jbHVkZSB5b3VyIGVtYWlsIGFuZCBwYXNzd29yZCB0aGF0IHlvdSB1c2VkIGluIHJlZ2lzdHJhdGlvbi4uCmJ1dCB0aGUgZm9ybWF0IGdvZXMgaW4gYSBqc29uIGZvcm1hdCB3aXRoICJlbWFpbCIgYW5kIHRoZSB2YWx1ZSBpcyB5b3VyIGVtYWlsIGFkZHJlc3MuIAphbmQgInBhc3N3b3JkIiBrZXkgd2l0aCB2YWx1ZSB5b3VyIHBhc3N3b3JkIHVzZWQgaW4gcmVnaXN0cmF0aW9uLgoKYWRkIHRoaXMgaW4geW91ciBib2R5IGFuZCBzZW5kIGEgcG9zdCByZXF1ZXN0IHRvIHRoZSBzYW1lIGFjY291bnQKCgppZiB5b3UgZm9yZ290IHlvdXIgcGFzc3dvcmQuLi4gb29vcHMgc29ycnkgd2UgZG9udCBoZWxwIHlvdSBhcm91bmYgdGhhdCB3YXkuLi4KdGhpcyBpcyBjeWJlcnNlY3VyaXR5IGNvbXAgc28gLi4gaWYgeW91IG5lZWQgeW91IGNhbiBoYWNrIG91ciBkYiBhbmQgZ2V0IHlvdSBwYXNzd29yZCBhbmQgcHJvY2VlZCBsb2w6PgoKc28gZW5kIG9mIGZpbGUgZ28gb24uLi4uLi4=</div>
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
