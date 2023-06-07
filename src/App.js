import { useState, useEffect, useRef } from 'react'
import typingImage from './typing-texting.gif'
import { GPT3 } from './OpenAiApi.js';


function replaceProductInfoWithImages(text) {
  //const productNameRegex = /Products Name: (.+)/g;
  const productImageRegex = /Product Image: (.+)/g;

  let replacedText = text;
  let productImageMatch;

  while ((productImageMatch = productImageRegex.exec(text))) {

    const productImage = productImageMatch[1];

    const imgTag = `<img width="100" src="${productImage}" alt="" />`;

    replacedText = replacedText.replace(productImageMatch[0], imgTag);
  }

  return replacedText;
}


const App = () => {
  const [ value, setValue ] = useState(null)
  const [ message, setMessage] = useState(null)
  const [ isSent, setIsSent] = useState(0)
  const [ previousChats, setPreviousChats ] = useState([])
  const [ currentTitle, setCurrentTitle ] = useState(null)
  const inputRef = useRef(null)
  const typingImageUrl = typingImage
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const chatDisplayRef = useRef(null);

  const createNewChat = () => {
    setMessage(null)
    setValue("")
    setCurrentTitle(null)
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle)
    setMessage(null)
    setValue("")    
  }

  const getMessages = async () => {
    if (inputRef.current.value.trim() === '') {
      return; // Prevent submission if input is empty or contains only whitespace
    }
    
    setIsSubmitted(true);

    setIsSent(1)
    inputRef.current.value = "";
    // const options = {
    //   method: "POST",
    //   body: JSON.stringify({
    //     message: value,
    //     previousChats: previousChats,
    //   }),
    //   headers: {
    //     "Content-Type": "application/json"
    //   }
    // }
    try{


      const messages =  [
        { role: "user", content: `Training data own dataset into training json form AI: Welcome to Carpet One Stafford, Australia! How can I help you today?
        Human: Do you have charming rainstorm?
        AI: I’m not sure I know that product, I might need some more information from you. Can you tell me more about what you’re looking for? For example, is it a Nylon Carpet or Vinyl Plank?
        Human: Vinyl Plank
        AI: Gotcha. I’m sorry, we don’t carry that particular product. But I have some great products that are very similar and are high quality. They are also priced very competitively as part of our cooperative buying power. \n\n Here are some excellent Vinyl Plank options I would recommend. \n\n Products name: Cushionstone – Casablanca \n Product Image: https://www.carpetone.com.au/stafford/wp-content/uploads/2020/11/CST659-SWATCH-500x320.jpg \n\n Products name: Cushionwood – Riverstone Oak \n Product Image: https://www.carpetone.com.au/stafford/wp-content/uploads/2020/11/CWM1201-SWATCH-500x320.jpg \n\n Would you like to see our full vinyl plank range? Or I can see Mary from Carpet One Stafford is online at the moment, would you like me to start a call with her?
        Human: Nylon Carpet
        AI: Gotcha. I’m sorry, we don’t carry that particular product. But I have some great products that are very similar and are high quality. They are also priced very competitively as part of our cooperative buying power. \n\n Here are some excellent Nylon Carpet options I would recommend. \n\n Products name: Dream Shadows – Vapar \n Product Image: https://www.carpetone.com.au/stafford/wp-content/uploads/2021/02/dream_shadows_vapar.jpg \n\n Products name: Dream Shadows – Buffalo \n Product Image: https://www.carpetone.com.au/stafford/wp-content/uploads/2021/02/dream_shadows_buffalo_0.jpg \n\n Would you like to see our full nylon carpet range? Or I can see Mary from Carpet One Stafford is online at the moment, would you like me to start a call with her?
        Human:I would like to see your full vinyl plank range, please. \nAI:` },
        { role: "assistant", content: "I would like to see your full vinyl plank range, please.\n" }
    ]
    if(previousChats){
        for (const chat of previousChats) {
            messages.push({role: chat.role.toLowerCase(), content: chat.content})
        }
    }
    messages.push( { role: "user", content: "Human: " + value.toLowerCase() + " AI:"} )
    
      const response = await GPT3.generateChat(messages);
      
      console.log(response.choices[0].message.content);


      //const response = await fetch( site_url + '/completions', options)
      
      //const data = await response.json()
      setMessage(response.choices[0].message)
      setIsSent(0)
      setIsSubmitted(false);
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    console.log(currentTitle, value, message)
    
    if (!currentTitle && value && message){
      setCurrentTitle(value)
    }
    if(currentTitle && value && message){
      setPreviousChats(prevChats => (
        [...prevChats,
          {
            title: currentTitle,
            role: "User",
            content: value
          },
          {
            title: currentTitle,
            role: "Assistant",
            content: message.content
          }
        ]
      ))
    }


  }, [message, currentTitle])



  // Function to scroll down the chat display
  // function scrollToBottom() {
  //   console.log("SCROLLED!!!")
  //   chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
  // }


  const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle)
 
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))


  function extractProducts(text) {
    const productRegex = /Products name: (.+)\nProduct Image: (.+)/g
    const products = []
    let match
  
    while ((match = productRegex.exec(text)) !== null) {
      const name = match[1]
      const image = match[2]
      products.push({ name, image })
    }
  
    return products
  }
  

  return (
    <div className="app">
      <section className="side-bar">
          <button onClick={createNewChat}>+ New chat</button>
          <ul className="history">
            {uniqueTitles?.map((uniqueTitle, index) => <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
          </ul>
          <nav>
            Products
          </nav>
      </section>
      <section className="main">
        {/* {!currentTitle && <h3>Welcome to Carpet One Stafford! How can I help you today?</h3>} */}
        <ul className="feed" ref={chatDisplayRef}>
          <li><p class="role">Carla:</p><p>Welcome to Carpet One Stafford! How can I help you today?</p></li>
          {currentChat.map((chatMessage, index) => <li key={index}>
            <p className="role">{(chatMessage.role === "Assistant")?'Carla':chatMessage.role}:</p>
            {/* <p>{chatMessage.content}</p> */}
            
            {/* <ChatMessage message={chatMessage.content} /> */}
            <pre dangerouslySetInnerHTML={{ __html: replaceProductInfoWithImages(chatMessage.content) }}></pre>
           </li>)}

            
            {isSent === 1 && (<li><p className="role">User:</p><p>{value}</p></li>)}
            {isSent === 1 && (<li className='assistant-wrapper'><p className="role">Carla:</p><p className='loading-wrapper'><img className="typing-image" src={typingImageUrl} /></p></li>)}
            
        </ul>
        <div className="bottom-section">
          <div className="input-container">

              <input disabled={isSubmitted} ref={inputRef}  onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => (e.key == 'Enter')?getMessages():""} />
              <div id="submit" onClick={getMessages}>Send</div>
          </div>
          <p className="info">
          Carla, our virtual assistant, is a work in progress, but she is always learning and improving. We appreciate your patience as Carla continues to learn and grow.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App
