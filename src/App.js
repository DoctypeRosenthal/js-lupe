import React, { useRef, useState } from 'react'
import './App.css';
import debounce from 'lodash.debounce';




const MINUTE_GRANULARITY = 5
const MINUTES_PER_HOUR = 60
const DAY_STARTS_AT = 8
const WOKE_HOURS = 15
const TICKS_PER_OUR = 12

const ticksArr = new Array(WOKE_HOURS*TICKS_PER_OUR + 1).fill(undefined)


// only return positive values
const g = x => x >= 0 ? x : 0

// a function for calculating the opacity and width of the ticks surrounding the mouse pointer
const f = (x, mousePosition) => -.000000001*(x - mousePosition)**4 + 1

const Tick = ({ mousePos, index }) => {
  const me = useRef({ offsetTop: 0 })
  const myTime = useRef(index * MINUTE_GRANULARITY / MINUTES_PER_HOUR + DAY_STARTS_AT)
  const isFullHour = useRef(Number.isInteger(myTime.current))
  const myOffset = me.current.offsetTop
  const magnifyingScalar = g(f(myOffset, mousePos))

  return (
    <div className="tick" ref={me} style={{minHeight: magnifyingScalar * 10 + 1 +  'px'}} >
      {isFullHour.current && <div className="tick__number">{myTime.current}</div>}
      <div className="tick__line" style={{ opacity: isFullHour.current ? 1 : magnifyingScalar, transform: `scaleX(${isFullHour.current ? 1 : magnifyingScalar})` }}/>
    </div>
  )
}


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
  const mouse = ({ clientY }) => setMousePos(clientY)
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
