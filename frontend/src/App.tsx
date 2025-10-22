import { useEffect, useRef, useState } from 'react'
import './App.css'
import { SendIcon } from './icons/SendIcon'

function App() {

  const [messages,setMessages] = useState([])
  const wsRef = useRef();
  const inputRef = useRef()
  const messagesEndRef = useRef(null);
  const [room,setRoom] = useState("Room 1")
  const [userId] = useState(() => Math.random().toString(36).substring(7))

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(()=>{
    const ws = new WebSocket("https://chat-application-using-websocket.onrender.com")
    ws.onmessage = (event) => {
      
      const data = JSON.parse(event.data)
      console.log(data.roomId);
      
      
        if (data.roomId === room) {
         setMessages(m => [...m, {
          text: data.message,
          senderId: data.senderId,
          isOwn: data.senderId === userId
        }])
  
        }     
 }
    wsRef.current = ws

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type:"join",
        payload:{
          roomId: room
        }
      }))
    }
    return () => {
      ws.close()
    }
  },[room])

  function sendMessage(){
    const message = inputRef.current?.value
            if (message) {
              wsRef.current.send(JSON.stringify({
                type: "chat",
                payload: {
                  message: message,
                  roomId: room,
                  senderId: userId

                }
              }))
            }
            inputRef.current.value = ""
  }


  return (
    <>
      <div className='h-screen bg-black flex flex-col  '>
        <div className='bg-gray-800 flex justify-between items-center'>
          <div className='text-white text-2xl p-4 m-2 font-bold'>Anonymous Chat</div>
            <div>
              <div className="relative inline-block w-48 m-2">
              <select 
                className="appearance-none w-full bg-gray-900 text-white p-3  rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                onChange={
                  (e)=>{
                    setMessages([])
                    setRoom(e.target.value)
                  }
                }
              >
                <option value="Room 1"  className="bg-gray-800 text-white">Room 1</option>
                <option value="Room 2"  className="bg-gray-800 text-white">Room 2</option>
                <option value="Room 3"  className="bg-gray-800 text-white">Room 3</option>
              </select>
              {/* Custom arrow */}
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            </div>
        </div>
        <div className=' h-screen flex flex-col justify-between '>
         <div className='flex-1 overflow-y-auto p-4 space-y-3 min-h-0'>
        {messages.length === 0 ? (
          <div className='text-gray-500 text-center mt-8'>
              No messages yet in {room}. Start the conversation!
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-lg p-3 max-w-[70%] shadow-lg ${
                message.isOwn 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-white'
              }`}>
                {!message.isOwn && (
                  <div className='text-xs text-gray-400 mb-1'>Anonymous</div>
                )}
                <span>{message.text}</span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
        <div className='w-full flex items-center'>
          <input ref={inputRef} type="text" placeholder='Send a Message...' className='w-full p-4 m-4 bg-gray-800 text-white placeholder:text-gray-400' onKeyDown={
            (e)=>{
              if (e.key==="Enter") {
                sendMessage()
              }
            }
          } />
          <button className='w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center' onClick={()=>{
            sendMessage()
            }}>{<SendIcon/>}</button>
        </div>
      </div>
      </div>
    </>
      
  )
}

export default App
