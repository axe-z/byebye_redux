import React,{ useReducer,useContext,useEffect,useRef } from 'react';

function appReducer (state,action) {
  //type est le premier arg , payload est le deuxieme arg, comme pour redux
  switch (action.type) {
    case "reset": {
      console.log(action,state)
      return action.payload

    }
    case "ajout": {
      console.log(action,state)
      return [
        ...state,
        {
          id: Date.now(),
          text: '',
          completer: false
        }
      ]
    }
    case "detruit": {
      return state.filter(item => item.id !== action.payload)
    }
    case 'completer': {
      return state.map(item => {
        if (item.id === action.payload) {
          return {
            ...item,
            completer: !item.completer,
          };
        }
        return item;
      });
    }
    default: {
      return state
    }
  }
}
const Context = React.createContext();


function UtiliseEffectOnce (cb) {
  const aRouler = useRef(false)
  useEffect(() => {
    if (!aRouler.current) {
      cb()
      aRouler.current = true;
    }
  });
}



export default function TodoApp () {
  const [state,dispatch] = useReducer(appReducer,[]); //state = [ ] dispatch = fn qui prend le type
  //console.log(state) //[]


  // const aRouler = useRef(false) //donne un wrapper.current


  useEffect(() => {
    localStorage.setItem("data",JSON.stringify(state));
  },[state]);  // roule quand state change

  UtiliseEffectOnce(() => {
    const debutData = localStorage.getItem("data");
    dispatch({ type: "reset",payload: debutData ? JSON.parse(debutData) : [] });
  });
  // useEffect(() => {
  // 	if(!aRouler.current){
  //   const debutData = localStorage.getItem("data");
  // 	dispatch({ type: "reset", payload: JSON.parse(debutData) });
  // 	aRouler.current = !aRouler.current;
  // }
  // }, []); // vide , roule juste un fois


  return (
    <Context.Provider value={dispatch}>
      <div>
        <h1>To do App</h1>
        <button onClick={() => dispatch({ type: "ajout" })}>
          Nouveau Todo
        </button>{" "}
        {/* pas besoin de payload */}
        <TodoList items={state} />
      </div>
    </Context.Provider>
  );
}

function TodoList ({ items }) {
  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          <TodoItem  {...item} />
        </div>
      ))}
    </div>
  )
}

function TodoItem ({ id,completer,text }) {
  const dispatch = useContext(Context); //au lieu d utiliser le context.Consumer , on a juste dispatch
  //  console.log(completer)
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 600
      }}
    >
      <br />
      <br />
      <input
        type="checkbox"
        checked={completer}
        onChange={() => dispatch({ type: 'completer',payload: id })}
      />
      <input type="text" defaultValue={text} style={completer ? { color: 'red' } : null} />
      <button onClick={() => dispatch({ type: 'detruit',payload: id })}>
        detruire
      </button>
    </div>
  );
}

