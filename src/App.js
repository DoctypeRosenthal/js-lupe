import React, { useRef, useState } from 'react'
import './App.css';
import debounce from 'lodash.debounce';


const g = x => x >= 0 ? x : 0

const f = (x, mousePos) => -.000000001*(x - mousePos)**4 + 1

const Tick = ({ mousePos, index }) => {
  const me = useRef({ offsetTop: 0 })
  const myTime = useRef(index*5/60 + DAY_START)
  const isFullHour = useRef(Number.isInteger(myTime.current))
  const myPos = me.current.offsetTop
  const myValue = g(f(myPos, mousePos))

  return (
    <div className="tick" ref={me} style={{minHeight: myValue * 10 + 1 +  'px'}} >
      {isFullHour.current && <div className="tick__number">{myTime.current}</div>}
      <div className="tick__line" style={{ opacity: isFullHour.current ? 1 : myValue, transform: `scaleX(${isFullHour.current ? 1 : myValue})` }}/>
    </div>
  )
}


const ticksArr = new Array(15*12 + 1).fill(undefined)

const DAY_START = 8
const Timeline = ({mousePos}) => {

  return (
    <div id="timeline">
      {ticksArr
        .map((_, i) => <Tick key={i} index={i} mousePos={mousePos}/>)
      }
    </div>
  )
}

const MemoTimeline = React.memo(Timeline)

function App() {
  const [mousePos, setMousePos] = useState(0)
  const me = useRef(null)
  const mouse = ({ clientY }) => {
    if (me.current?.offsetTop)
    setMousePos(clientY)
  }
  const debouncedMouse = debounce(mouse,1, {leading: true})

 return (
    <div className="App"
       onMouseMove={debouncedMouse}
       ref={me}
    >
      <div className="timeline-filter" />
        <MemoTimeline mousePos={mousePos}/>
    </div>
  );
}

export default App;
